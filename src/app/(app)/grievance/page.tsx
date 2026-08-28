"use client";

import { useState } from "react";
import { useScenario } from "@/context/ScenarioContext";
import { Search, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function GrievancePage() {
  const { profile } = useScenario();
  const [activeTab, setActiveTab] = useState<"register" | "status">("register");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    setTimeout(() => {
      setSubmitStatus("success");
    }, 1500);
  };

  return (
    <div className="space-y-12 pb-24">
      <header className="border-b border-[#131215]/10 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="font-serif text-4xl font-medium tracking-wide text-[#131215]">EPFiGMS Grievance</h1>
            <p className="text-[10px] tracking-widest text-[#131215]/40 uppercase mt-2">EPFO Grievance Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-b border-[#131215]/5 pb-0">
          <button 
            onClick={() => setActiveTab("register")}
            className={"pb-3 text-[10px] font-medium tracking-widest uppercase transition-colors relative " + (activeTab === "register" ? "text-[#131215]" : "text-[#131215]/40 hover:text-[#131215]")}
          >
            Register Grievance
            {activeTab === "register" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#131215]" />}
          </button>
          <button 
            onClick={() => setActiveTab("status")}
            className={"pb-3 text-[10px] font-medium tracking-widest uppercase transition-colors relative " + (activeTab === "status" ? "text-[#131215]" : "text-[#131215]/40 hover:text-[#131215]")}
          >
            Track Status
            {activeTab === "status" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#131215]" />}
          </button>
        </div>
      </header>

      {activeTab === "register" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
          <form onSubmit={handleSubmit} className="border border-[#131215]/10 bg-white p-6 sm:p-8 space-y-6">
            
            {submitStatus === "success" ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-[#2c524b]/10 flex items-center justify-center mb-4 text-[#2c524b]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl text-[#131215] mb-2">Grievance Registered</h3>
                <p className="text-sm text-[#131215]/70 mb-6 max-w-sm">
                  Your grievance has been successfully submitted to the Regional PF Office. Registration Number: <strong>EPF/2026/84729</strong>
                </p>
                <button 
                  type="button"
                  onClick={() => setActiveTab("status")}
                  className="bg-[#131215] text-[#F7F5F0] px-6 py-3 text-[10px] font-medium tracking-widest uppercase rounded-sm hover:bg-[#131215]/90 transition-colors"
                >
                  Track Status
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-medium uppercase tracking-widest text-[#131215]/60 mb-2">PF Member Name</label>
                      <input type="text" disabled value={profile.name} className="w-full border border-[#131215]/10 bg-[#F7F5F0] px-4 py-3 text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium uppercase tracking-widest text-[#131215]/60 mb-2">UAN</label>
                      <input type="text" disabled value={profile.uan} className="w-full border border-[#131215]/10 bg-[#F7F5F0] px-4 py-3 text-sm focus:outline-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-[#131215]/60 mb-2">Grievance Category</label>
                    <select className="w-full appearance-none border border-[#131215]/10 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#2c524b]">
                      <option>Final Settlement / Form 19 / 10C</option>
                      <option>Transfer of PF / Form 13</option>
                      <option>Advance / Partial Withdrawal / Form 31</option>
                      <option>KYC Related Issues</option>
                      <option>Passbook / Balance Related</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium uppercase tracking-widest text-[#131215]/60 mb-2">Description</label>
                    <textarea rows={5} className="w-full border border-[#131215]/10 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#2c524b] resize-none" placeholder="Provide detailed information regarding your grievance..."></textarea>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#131215]/5 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={submitStatus === "submitting"}
                    className="inline-flex items-center gap-2 bg-[#2c524b] text-white px-6 py-3 text-[10px] font-medium tracking-widest uppercase rounded-sm hover:bg-[#2c524b]/90 transition-colors disabled:opacity-70"
                  >
                    {submitStatus === "submitting" ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-3 w-3 border-2 border-white/60 border-t-transparent rounded-full" />
                    ) : (
                      <Send className="h-3 w-3" />
                    )}
                    {submitStatus === "submitting" ? "Submitting..." : "Submit Grievance"}
                  </button>
                </div>
              </>
            )}
          </form>
        </motion.div>
      )}

      {activeTab === "status" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
          <div className="relative max-w-sm">
            <input 
              type="text" 
              placeholder="Enter Registration Number" 
              className="w-full border border-[#131215]/10 bg-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#2c524b]" 
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#131215]/40" />
          </div>

          <div className="border border-[#131215]/10 bg-white">
            <div className="p-6 border-b border-[#131215]/10 bg-[#F7F5F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-[#2c524b]/10 text-[#2c524b] flex items-center justify-center rounded-full">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#131215]">EPF/2026/14992</h3>
                  <p className="text-[10px] tracking-widest uppercase text-[#131215]/60 mt-0.5">Filed on Oct 02, 2026</p>
                </div>
              </div>
              <span className="inline-flex px-2 py-0.5 border border-[#131215]/10 text-[#131215]/60 uppercase text-[9px] font-medium tracking-widest whitespace-nowrap">
                Under Process
              </span>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-[#131215]/40 mb-1">Category</p>
                <p className="text-sm text-[#131215]">Final Settlement / Form 19 / 10C</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-[#131215]/40 mb-1">Description</p>
                <p className="text-sm text-[#131215]/80 leading-relaxed">
                  My claim for final settlement has been stuck at Field Office review for over 21 days without any queries raised. Please expedite the process as the SLA is 7 days.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
