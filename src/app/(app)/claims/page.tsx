"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useScenario } from "@/context/ScenarioContext";

const cubicTransition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

function ClaimsContent() {
  const searchParams = useSearchParams();
  const { scenario, profile, jdStatus, setJdStatus } = useScenario();
  const hasMismatch = scenario === "MISMATCH";
  const autoFixTriggered = searchParams.get("fix") === "true";
  const prefersReducedMotion = useReducedMotion();


  const [showJdModal, setShowJdModal] = useState(autoFixTriggered && hasMismatch);

  const [grievanceStatus, setGrievanceStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newClaimStep, setNewClaimStep] = useState<number>(0);
  const [hasFiledClaim, setHasFiledClaim] = useState(false);

  let steps = [];
  if (scenario === "CLEAN" && hasFiledClaim) {
    steps = [
      { id: 1, label: "Claim Submitted", status: "completed", date: "Today" },
      { id: 2, label: "Employer Approval", status: "upcoming", date: "" },
      { id: 3, label: "Field Office Review", status: "upcoming", date: "" },
      { id: 4, label: "Bank Credit", status: "upcoming", date: "" },
    ];
  } else if (scenario === "MISMATCH") {
    steps = [
      { id: 1, label: "Claim Submitted", status: "completed", date: "Oct 12" },
      { id: 2, label: "Employer Approval", status: "completed", date: "Oct 14" },
      { id: 3, label: "Field Office Review", status: "error", date: "Oct 16" },
      { id: 4, label: "Bank Credit", status: "upcoming", date: "" },
    ];
  } else if (scenario === "MERGE") {
    steps = [
      { id: 1, label: "Claim Submitted", status: "completed", date: "Oct 12" },
      { id: 2, label: "Employer Approval", status: "error", date: "Oct 13" },
      { id: 3, label: "Field Office Review", status: "upcoming", date: "" },
      { id: 4, label: "Bank Credit", status: "upcoming", date: "" },
    ];
  } else if (scenario === "NOMINATION") {
    steps = [
      { id: 1, label: "Claim Submitted", status: "error", date: "Oct 12" },
      { id: 2, label: "Employer Approval", status: "upcoming", date: "" },
      { id: 3, label: "Field Office Review", status: "upcoming", date: "" },
      { id: 4, label: "Bank Credit", status: "upcoming", date: "" },
    ];
  } else {
    steps = [
      { id: 1, label: "Claim Submitted", status: "completed", date: "Oct 12" },
      { id: 2, label: "Employer Approval", status: "completed", date: "Oct 14" },
      { id: 3, label: "Field Office Review", status: "completed", date: "Oct 18" },
      { id: 4, label: "Bank Credit", status: "completed", date: "Oct 19" },
    ];
  }

  let modalTitle = "";
  let modalDiscLabel = "";
  let modalDiscLeftLabel = "";
  let modalDiscLeftText = "";
  let modalDiscRightLabel = "";
  let modalDiscRightText = "";
  let modalDraftText = null;
  let modalBtnText = "Authenticate & Submit";
  let modalSuccessMsg = "";
  let modalSuccessSub = "";

  if (scenario === "MISMATCH") {
    modalTitle = "Auto-Joint Declaration";
    modalDiscLabel = "Detected Discrepancy";
    modalDiscLeftLabel = "Aadhaar (Verified)";
    modalDiscLeftText = profile.panName;
    modalDiscRightLabel = "UAN Record";
    modalDiscRightText = profile.name;
    modalDraftText = (
      <div className="bg-white border border-[#131215]/10 p-6 text-xs leading-relaxed text-[#131215]">
        <p className="mb-4 font-bold">To, The Regional PF Commissioner,</p>
        <p className="mb-4">Sub: Joint Declaration by the member and the employer for correction of Name.</p>
        <p className="mb-4">I, <span className="font-bold">{profile.panName}</span>, having UAN <span className="font-bold">{profile.uan}</span>, request you to update my name in the EPFO records to match my Aadhaar.</p>
        <p>The erroneous name <span className="line-through">"{profile.name}"</span> was updated during initial registration.</p>
      </div>
    );
    modalSuccessMsg = "Forwarded to TechCorp India Pvt Ltd for digital approval.";
    modalSuccessSub = "Employer approval usually takes 2-3 working days.";
  } else if (scenario === "MERGE") {
    modalTitle = "Auto-Form 13 Transfer";
    modalDiscLabel = "Service Overlap Detected";
    modalDiscLeftLabel = "Previous PF ID";
    modalDiscLeftText = "MH/PUN/7654321/000/1234567";
    modalDiscRightLabel = "Status";
    modalDiscRightText = "Unmerged";
    modalDraftText = (
      <div className="bg-white border border-[#131215]/10 p-6 text-xs leading-relaxed text-[#131215]">
        <p className="mb-4 font-bold">To, The Regional PF Commissioner,</p>
        <p className="mb-4">Sub: Transfer of EPF Accumulations from previous accounts to current UAN.</p>
        <p className="mb-4">I, <span className="font-bold">{profile.name}</span>, request you to transfer my EPF balance from MH/PUN/7654321/000/1234567 to my current active UAN <span className="font-bold">{profile.uan}</span>.</p>
      </div>
    );
    modalSuccessMsg = "Form 13 Submitted Successfully.";
    modalSuccessSub = "Pending Field Office approval for account merger.";
  } else if (scenario === "NOMINATION") {
    modalTitle = "Digital e-Nomination";
    modalDiscLabel = "Compliance Issue";
    modalDiscLeftLabel = "e-Nomination";
    modalDiscLeftText = "Not Found";
    modalDiscRightLabel = "Requirement";
    modalDiscRightText = "Mandatory for Form 19";
    modalBtnText = "Authenticate via Aadhaar OTP";
    modalDraftText = (
      <div className="bg-white border border-[#131215]/10 p-6 text-xs leading-relaxed text-[#131215]">
        <p className="mb-4 font-bold">Declaration of Nominee under EPS 1995</p>
        <p className="mb-4">I hereby nominate the following person to receive the amount that may stand to my credit in the Employees' Provident Fund in the event of my death:</p>
        <p className="mb-2">Name: <span className="font-bold">Rahul Verma Sr.</span></p>
        <p className="mb-2">Relation: <span className="font-bold">Father</span></p>
        <p>Share: <span className="font-bold">100%</span></p>
      </div>
    );
    modalSuccessMsg = "Nominee Saved Successfully.";
    modalSuccessSub = "Aadhaar e-Sign verification completed.";
  }

  const handleFix = () => {
    setJdStatus("submitting");
    setTimeout(() => {
      setJdStatus("success");
      setTimeout(() => setShowJdModal(false), 2000);
    }, 1500);
  };

  const handleGrievance = () => {
    setGrievanceStatus("submitting");
    setTimeout(() => {
      setGrievanceStatus("success");
      setTimeout(() => setShowGrievanceModal(false), 2000);
    }, 1500);
  };

  return (
    <div className="space-y-12">
      <header className="border-b border-[#131215]/10 pb-8">
        <p className="text-[10px] tracking-widest text-[#131215]/40 uppercase mb-2">Active Claim</p>
        <h1 className="font-serif text-3xl font-medium tracking-wide text-[#131215]">
          {scenario === "CLEAN" ? "Claims Dashboard" : "Form 19 (Final Settlement)"}
        </h1>
      </header>

      {(scenario === "CLEAN" && !hasFiledClaim) ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-[#131215]/10 bg-white relative overflow-hidden group">
          {/* Subtle animated background grid or rings can go here */}
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8 relative"
          >
            <div className="absolute inset-0 bg-[#2c524b]/5 blur-2xl rounded-full" />
            <svg className="w-16 h-16 text-[#131215]/20 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </motion.div>
          
          <h2 className="font-serif text-2xl text-[#131215] mb-2">No active claims yet</h2>
          <p className="text-sm text-[#131215]/60 mb-8 max-w-sm mx-auto">Your service ledger is clean. Ready to file your first withdrawal or transfer claim?</p>
          <button 
            onClick={() => setShowNewClaimModal(true)}
            className="min-h-[44px] border border-[#2c524b] bg-[#2c524b] px-6 py-2 text-xs font-medium tracking-widest text-white uppercase transition-all hover:bg-[#1e3b35] hover:shadow-lg hover:-translate-y-0.5"
          >
            File a New Claim
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Timeline */}
          <div className="col-span-1 lg:col-span-2">
            <div className="space-y-8 pl-4">
              {steps.map((step, idx) => (
                <motion.div 
                  key={step.id} 
                  className="relative"
                  initial={
                    step.status === "upcoming" 
                      ? { x: prefersReducedMotion ? 0 : -20 } 
                      : false
                  }
                  animate={
                    step.status === "upcoming" 
                      ? { x: 0 } 
                      : false
                  }
                  transition={{ 
                    duration: 0.5, 
                    delay: idx * 0.1, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                >
                  {idx !== steps.length - 1 && (
                    <div className={cn(
                      "absolute left-[11px] top-8 h-[calc(100%+2rem)] w-[1px]",
                      step.status === "completed" ? "bg-[#131215]" : "bg-[#131215]/10"
                    )} />
                  )}
                  
                  <div className="flex items-start gap-6">
                    <div className={cn(
                      "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center bg-[#F7F5F0]",
                      step.status === "completed" ? "text-[#131215]" : 
                      step.status === "error" ? "text-red-700" : "text-[#131215]/20"
                    )}>
                      {step.status === "completed" ? (
                        <svg className="h-5 w-5 text-[#131215]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                          <motion.path 
                            initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            d="M20 6L9 17l-5-5" 
                          />
                        </svg>
                      ) : step.status === "error" ? (
                        <>
                          <motion.div
                            animate={{ scale: prefersReducedMotion ? 1 : [1, 1.6, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border border-red-700 opacity-40"
                          />
                          <AlertCircle className="h-5 w-5 relative z-10" />
                        </>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </div>
                    
                    <div className="pt-0.5">
                      <h3 className={cn(
                        "text-lg font-medium",
                        step.status === "upcoming" ? "text-[#131215]/40" : 
                        step.status === "error" ? "text-red-700" : "text-[#131215]"
                      )}>
                        {step.label}
                      </h3>
                      <p className="mt-1 text-[10px] tracking-widest uppercase text-[#131215]/40">
                        {step.date || "Pending"}
                      </p>

                      {step.status === "error" && (
                        <div className="mt-4 border p-4 max-w-md transition-colors duration-500 min-h-[160px] flex flex-col justify-center border-red-700 bg-white">
                          {(scenario !== "CLEAN" && jdStatus === "success") ? (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-center py-2"
                            >
                              <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center bg-[#F7F5F0] border border-[#2c524b]/20 rounded-full shadow-[0_0_20px_rgba(44,82,75,0.15)]">
                                <svg className="h-6 w-6 text-[#2c524b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                  <motion.path 
                                    initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    d="M20 6L9 17l-5-5" 
                                  />
                                </svg>
                              </div>
                              <p className="text-sm font-medium mb-1 text-[#131215]">Forwarded to Employer</p>
                              <p className="text-xs text-[#131215]/60 mb-4">TechCorp India Pvt Ltd approval pending (Est. 2-3 days)</p>
                              <button onClick={() => setShowDetailsModal(true)} className="w-full border border-[#131215]/10 bg-[#F7F5F0] px-4 py-2.5 text-[10px] font-medium tracking-widest text-[#131215] uppercase transition-colors hover:bg-[#131215]/5">Track this request</button>
                            </motion.div>
                          ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              <p className="text-[10px] font-medium tracking-widest uppercase text-red-700 mb-2 flex items-center gap-2">
                                Claim Halted
                                {grievanceStatus === "success" && (
                                  <span className="text-[9px] font-medium tracking-widest uppercase text-amber-700 border border-amber-700/20 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                                    Grievance Raised
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-[#131215] mb-4">
                                {scenario === "MISMATCH" && "Name mismatch detected between Aadhaar and UAN records. This will cause a rejection."}
                                {scenario === "MERGE" && "Multiple unmerged accounts detected. Service overlap requires Form 13 transfer before withdrawal."}
                                {scenario === "NOMINATION" && "Missing e-Nomination. Mandatory Aadhaar-signed nomination required for Form 19/10C."}
                              </p>
                              <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                  onClick={() => setShowJdModal(true)}
                                  className="min-h-[44px] border border-red-700 bg-red-700 px-4 py-2 text-[10px] font-medium tracking-widest text-white uppercase hover:bg-red-800 transition-colors"
                                >
                                  Launch Auto-Fix
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Claim Details */}
          <div className="col-span-1 border-l border-[#131215]/10 pl-12 hidden lg:block">
            <p className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/40 mb-6">
              Ledger Overview
            </p>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-[#131215]/40 mb-1">Claimed Amount</p>
                <p className="font-serif text-3xl text-[#131215] tabular-nums">Ã¢â€šÂ¹3,50,000</p>
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-[#131215]/40 mb-1">Target Account</p>
                <p className="text-sm font-medium text-[#131215]">HDFC Bank</p>
                <p className="text-xs text-[#131215]/60">Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢ 4012</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showJdModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={cubicTransition}
              className="fixed inset-0 z-50 bg-[#131215]/10 backdrop-blur-sm"
              onClick={() => setShowJdModal(false)}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={cubicTransition}
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[95dvh] w-full flex-col overflow-y-auto rounded-t-3xl border-t border-[#131215]/10 bg-[#F7F5F0] px-6 pb-8 pt-4 shadow-2xl md:inset-x-auto md:inset-y-0 md:right-0 md:max-h-none md:w-[480px] md:rounded-none md:border-l md:border-t-0 md:p-8"
            >
              {/* Drag Handle (Mobile) */}
              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-[#131215]/10 md:hidden" />

              <div className="flex justify-between items-center mb-8 md:mb-12 border-b border-[#131215]/10 pb-4">
                  <h2 className="font-serif text-2xl font-medium text-[#131215]">{modalTitle}</h2>
                  <button 
                    onClick={() => setShowJdModal(false)} 
                    className="flex h-11 w-11 items-center justify-center text-[#131215]/40 hover:text-[#131215] -mr-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
  
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-medium tracking-widest uppercase text-red-700 mb-2">{modalDiscLabel}</p>
                    <div className="grid grid-cols-2 gap-4 border border-[#131215]/10 p-4">
                      <div>
                        <p className="text-[10px] tracking-widest uppercase text-[#131215]/40 mb-1">{modalDiscLeftLabel}</p>
                        <p className="font-serif text-lg text-[#131215]">{modalDiscLeftText}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-widest uppercase text-[#131215]/40 mb-1">{modalDiscRightLabel}</p>
                        <p className="font-serif text-lg text-red-700">{modalDiscRightText}</p>
                      </div>
                    </div>
                  </div>
  
                  <div>
                    <p className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/40 mb-2">Drafted Legal Request</p>
                    {modalDraftText}
                  </div>
  
                  {jdStatus === "idle" && (
                    <button 
                      onClick={handleFix}
                      className="w-full min-h-[44px] border border-[#2c524b] bg-[#2c524b] px-4 py-4 text-xs font-medium tracking-widest text-white uppercase transition-colors hover:bg-[#1e3b35] flex items-center justify-center gap-2"
                    >
                      {modalBtnText} <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
  
                  {jdStatus === "submitting" && (
                    <div className="flex flex-col items-center justify-center py-8 text-[#131215]/40">
                      <Loader2 className="h-8 w-8 animate-spin mb-4 text-[#2c524b]" />
                      <p className="text-[10px] tracking-widest uppercase">Applying e-Signatures...</p>
                    </div>
                  )}
  
                  {jdStatus === "success" && (
                    <div className="flex flex-col items-center justify-center py-8 text-[#131215]">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center bg-[#F7F5F0] border border-[#2c524b]/20 rounded-full shadow-[0_0_40px_rgba(44,82,75,0.2)]">
                        <svg className="h-8 w-8 text-[#2c524b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                          <motion.path 
                            initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                            d="M20 6L9 17l-5-5" 
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium mb-2 text-center">{modalSuccessMsg}</p>
                      <p className="text-xs text-[#131215]/60 mt-2 text-center mb-6">{modalSuccessSub}</p>
                      <button 
                        onClick={() => {
                          setShowJdModal(false);
                          setShowDetailsModal(true);
                        }}
                        className="min-h-[44px] w-full border border-[#131215]/10 bg-transparent px-4 py-2 text-[10px] font-medium tracking-widest text-[#131215] uppercase transition-colors hover:bg-[#131215]/5"
                      >
                        Track this request
                      </button>
                    </div>
                  )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGrievanceModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#131215]/20 backdrop-blur-sm"
              onClick={() => setShowGrievanceModal(false)}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={cubicTransition}
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[95dvh] w-full flex-col overflow-y-auto rounded-t-3xl border-t border-[#131215]/10 bg-[#F7F5F0] px-6 pb-8 pt-4 shadow-2xl md:inset-x-auto md:inset-y-0 md:right-0 md:max-h-none md:w-[480px] md:rounded-none md:border-l md:border-t-0 md:p-8"
            >
              {/* Drag Handle (Mobile) */}
              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-[#131215]/10 md:hidden" />

              <div className="flex justify-between items-center mb-8 md:mb-12 border-b border-[#131215]/10 pb-4">
                <h2 className="font-serif text-2xl font-medium text-[#131215]">File EPFiGMS Grievance</h2>
                <button 
                  onClick={() => setShowGrievanceModal(false)} 
                  className="flex h-11 w-11 items-center justify-center text-[#131215]/40 hover:text-[#131215] -mr-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 space-y-8">
                {grievanceStatus === "idle" && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-[#131215]/40 mb-1">Grievance Category</p>
                        <p className="text-sm text-[#131215]">Delay in Final Settlement (Form 19)</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-[#131215]/40 mb-1">Description</p>
                        <p className="text-sm text-[#131215] p-3 border border-[#131215]/10 bg-white">
                          My claim has been pending beyond the 7-day SLA at the Field Office. I request an urgent update on the status.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {grievanceStatus === "idle" && (
                  <button 
                    onClick={handleGrievance}
                    className="w-full min-h-[44px] border border-[#2c524b] bg-[#2c524b] px-4 py-4 text-xs font-medium tracking-widest text-white uppercase transition-colors hover:bg-[#1e3b35] flex items-center justify-center gap-2"
                  >
                    Submit Grievance <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                {grievanceStatus === "submitting" && (
                  <div className="flex flex-col items-center justify-center py-8 text-[#131215]/40">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-[#2c524b]" />
                    <p className="text-[10px] tracking-widest uppercase">Filing Grievance...</p>
                  </div>
                )}

                {grievanceStatus === "success" && (
                  <div className="flex flex-col items-center justify-center py-8 text-[#131215]">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center">
                      <svg className="h-8 w-8 text-[#2c524b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                        <motion.path 
                          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          d="M20 6L9 17l-5-5" 
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium mb-2 text-center">Grievance filed Ã¢â‚¬â€ reference #EPFiGMS-88392X</p>
                    <p className="text-xs text-[#131215]/60 mt-2 text-center mb-6">You will receive an SMS update within 24 hours.</p>
                    <button 
                      onClick={() => setShowGrievanceModal(false)}
                      className="min-h-[44px] w-full border border-[#131215]/10 bg-transparent px-4 py-2 text-[10px] font-medium tracking-widest text-[#131215] uppercase transition-colors hover:bg-[#131215]/5"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

            <AnimatePresence>
        {showDetailsModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#131215]/20 backdrop-blur-sm"
              onClick={() => setShowDetailsModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={cubicTransition}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 bg-white border border-[#131215]/10 p-6 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-serif text-xl font-medium text-[#131215]">Claim Details</h2>
                  <p className="text-[10px] uppercase tracking-widest text-[#131215]/40 mt-1">Ref: #EPF-8893-XJ</p>
                </div>
                <button onClick={() => setShowDetailsModal(false)} className="text-[#131215]/40 hover:text-[#131215]">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/60 mb-2">Claim Type</p>
                  <p className="text-sm font-medium text-[#131215]">Form 19 (Final Settlement)</p>
                </div>
                
                <div>
                  <p className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/60 mb-2">Submitted Documents</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border border-[#131215]/10 bg-[#F7F5F0]/50">
                      <span className="text-xs text-[#131215]">Aadhaar_Card.pdf</span>
                      <button className="text-[10px] uppercase tracking-widest text-[#2c524b] font-medium">View</button>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-[#131215]/10 bg-[#F7F5F0]/50">
                      <span className="text-xs text-[#131215]">Cancelled_Cheque.jpg</span>
                      <button className="text-[10px] uppercase tracking-widest text-[#2c524b] font-medium">View</button>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-[#131215]/10 bg-[#F7F5F0]/50">
                      <span className="text-xs text-[#131215]">Form_15G.pdf</span>
                      <button className="text-[10px] uppercase tracking-widest text-[#2c524b] font-medium">View</button>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/60 mb-2">Processing History</p>
                  <div className="space-y-3 relative before:absolute before:inset-y-2 before:left-[3px] before:w-px before:bg-[#131215]/10 pl-4">
                    <div className="relative">
                      <div className="absolute -left-[17.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-[#2c524b]" />
                      <p className="text-xs font-medium text-[#131215]">Claim Submitted</p>
                      <p className="text-[10px] text-[#131215]/40">12 Oct 2026, 10:45 AM</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[17.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-[#2c524b]" />
                      <p className="text-xs font-medium text-[#131215]">Employer Verification Complete</p>
                      <p className="text-[10px] text-[#131215]/40">14 Oct 2026, 02:10 PM</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[17.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <p className="text-xs font-medium text-[#131215]">Pending at Field Office</p>
                      <p className="text-[10px] text-[#131215]/40">15 Oct 2026, 09:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNewClaimModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#131215]/20 backdrop-blur-sm"
              onClick={() => setShowNewClaimModal(false)}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={cubicTransition}
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[95dvh] w-full flex-col overflow-y-auto rounded-t-3xl border-t border-[#131215]/10 bg-[#F7F5F0] px-6 pb-8 pt-4 shadow-2xl md:inset-x-auto md:inset-y-0 md:right-0 md:max-h-none md:w-[480px] md:rounded-none md:border-l md:border-t-0 md:p-8"
            >
              {/* Drag Handle */}
              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-[#131215]/10 md:hidden" />

              <div className="flex justify-between items-center mb-8 border-b border-[#131215]/10 pb-4">
                <h2 className="font-serif text-2xl font-medium text-[#131215]">New Claim</h2>
                <button 
                  onClick={() => {
                    setShowNewClaimModal(false);
                    setNewClaimStep(0);
                  }} 
                  className="flex h-11 w-11 items-center justify-center text-[#131215]/40 hover:text-[#131215] -mr-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1">
                {newClaimStep === 0 && (
                  <div className="space-y-4">
                    <p className="text-sm text-[#131215]/60 mb-6">Select the type of claim you wish to initiate.</p>
                    
                    <button onClick={() => setNewClaimStep(1)} className="w-full text-left p-4 border border-[#131215]/10 bg-white hover:bg-[#131215]/5 transition-colors group relative overflow-hidden">
                      <p className="font-serif text-lg text-[#131215] mb-1 group-hover:translate-x-1 transition-transform">Form 19 (Final Settlement)</p>
                      <p className="text-xs text-[#131215]/60">Withdraw your entire PF balance after leaving service.</p>
                    </button>

                    <button onClick={() => setNewClaimStep(1)} className="w-full text-left p-4 border border-[#131215]/10 bg-white hover:bg-[#131215]/5 transition-colors group relative overflow-hidden">
                      <p className="font-serif text-lg text-[#131215] mb-1 group-hover:translate-x-1 transition-transform">Form 10C (Pension Withdrawal)</p>
                      <p className="text-xs text-[#131215]/60">Withdraw your EPS balance (if service is less than 10 years).</p>
                    </button>

                    <button onClick={() => setNewClaimStep(1)} className="w-full text-left p-4 border border-[#131215]/10 bg-white hover:bg-[#131215]/5 transition-colors group relative overflow-hidden">
                      <p className="font-serif text-lg text-[#131215] mb-1 group-hover:translate-x-1 transition-transform">Form 31 (Partial Advance)</p>
                      <p className="text-xs text-[#131215]/60">Withdraw a portion for medical, marriage, or housing needs.</p>
                    </button>
                  </div>
                )}

                {newClaimStep === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div>
                      <p className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/40 mb-2">Eligibility Check</p>
                      <div className="bg-white border border-[#2c524b]/20 p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-2 w-2 rounded-full bg-[#2c524b]" />
                          <p className="text-sm font-medium text-[#131215]">You are eligible</p>
                        </div>
                        <p className="text-xs text-[#131215]/60 pl-5">Based on your service history and KYC, you meet the criteria for this claim.</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/40 mb-2">Estimated Amount</p>
                      <p className="font-serif text-4xl text-[#131215]">Ã¢â€šÂ¹3,50,000 <span className="text-[10px] uppercase font-sans tracking-widest text-amber-700 bg-amber-50 px-1.5 py-0.5 border border-amber-700/20 rounded-sm ml-2 align-middle">(Simulated)</span></p>
                    </div>

                    <div className="pt-6 border-t border-[#131215]/10">
                      <button 
                        onClick={() => setNewClaimStep(2)}
                        className="w-full min-h-[44px] bg-[#2c524b] text-white text-[10px] font-medium tracking-widest uppercase hover:bg-[#1e3b35] transition-colors"
                      >
                        Submit Application
                      </button>
                    </div>
                  </div>
                )}

                {newClaimStep === 2 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-500">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center bg-[#F7F5F0] border border-[#2c524b]/20 rounded-full shadow-[0_0_40px_rgba(44,82,75,0.2)]">
                      <svg className="h-8 w-8 text-[#2c524b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                          d="M20 6L9 17l-5-5" 
                        />
                      </svg>
                    </div>
                    <h3 className="font-serif text-2xl text-[#131215] mb-2">Claim Initiated</h3>
                    <p className="text-sm text-[#131215]/60 mb-8 max-w-[250px] mx-auto">Your application has been logged and sent to the field office.</p>
                    <button 
                      onClick={() => {
                        setShowNewClaimModal(false);
                        setNewClaimStep(0);
                        setHasFiledClaim(true);
                      }}
                      className="w-full min-h-[44px] border border-[#131215]/10 text-[#131215] text-[10px] font-medium tracking-widest uppercase hover:bg-[#131215]/5 transition-colors"
                    >
                      Return to Ledger
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ClaimsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#131215]/40 text-[10px] tracking-widest uppercase">Loading ledger...</div>}>
      <ClaimsContent />
    </Suspense>
  );
}





