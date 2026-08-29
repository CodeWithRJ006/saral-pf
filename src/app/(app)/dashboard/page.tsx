"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { useScenario } from "@/context/ScenarioContext";
import Link from "next/link";
import { fetchChatCompletion } from "@/lib/openai";
import { AlertTriangle, CheckCircle2, FileText, Share2, ArrowRight } from "lucide-react";

const PIE_COLORS = ["#131215", "#2c524b", "#a3a3a3"];

const PreClaimDiagnostic = ({ profile, jdStatus }: { profile: any, jdStatus: string }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 900);
    const t3 = setTimeout(() => setStep(3), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="border border-[#131215]/10 bg-white p-6 mb-6">
      <div className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/40 mb-6 font-sans">
        PRE-CLAIM CHECKS
      </div>
      
      <div className="space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#131215]/70">Checking UAN status...</span>
          {step >= 1 && (
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-[#131215]/10 text-[#131215] bg-[#F7F5F0]"
            >
              <CheckCircle2 className="w-3 h-3 text-[#2c524b]" />
              <span className="uppercase text-[9px] font-sans font-medium tracking-widest">Verified</span>
            </motion.span>
          )}
        </div>

        {step >= 2 && (
          <div className="flex items-center justify-between">
            <span className="text-[#131215]/70">Cross-referencing UIDAI records...</span>
            {step >= 3 && (
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-red-700/20 bg-red-50 text-red-700"
              >
                <span className="uppercase text-[9px] font-sans font-medium tracking-widest">Failed — 1-char mismatch</span>
              </motion.span>
            )}
          </div>
        )}
      </div>
      {step >= 3 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-8 pt-8 border-t border-[#131215]/10 font-sans"
        >
          {jdStatus === "success" ? (
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="h-12 w-12 bg-[#F7F5F0] border border-[#2c524b]/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-[#2c524b]" />
              </div>
              <h3 className="text-sm font-medium text-[#131215] mb-1">Joint Declaration Forwarded</h3>
              <p className="text-xs text-[#131215]/60 mb-6">Pending employer approval from TechCorp India Pvt Ltd. (Est. 2-3 days)</p>
              <Link href="/claims" className="w-full inline-flex min-h-[44px] items-center justify-center bg-[#131215] px-4 py-2 text-[10px] font-medium tracking-widest text-[#F7F5F0] uppercase transition-colors hover:bg-[#131215]/90">
                Track Status
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 w-full h-40 bg-[#F7F5F0] border border-[#131215]/5 flex items-center justify-center overflow-hidden relative">
                <svg viewBox="0 0 200 120" className="w-full h-full text-[#2c524b]" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <g strokeWidth="0.5" strokeOpacity="0.3">
                    <path d="M 10 90 L 100 0 M 20 100 L 120 0 M 30 110 L 140 0 M 40 120 L 160 0 M 60 120 L 180 0 M 80 120 L 200 0 M 100 120 L 220 0" />
                  </g>
                  <path d="M 100 45 C 90 45 85 55 85 65 C 85 70 75 85 75 120 L 125 120 C 125 85 115 70 115 65 C 115 55 110 45 100 45 Z" />
                  <path d="M 95 65 C 95 65 100 70 105 65" />
                  <path d="M 45 55 L 75 45 L 65 85 L 35 95 Z" fill="#F7F5F0" />
                  <path d="M 48 65 L 60 61 M 45 75 L 55 72" />
                  <path d="M 155 55 L 125 45 L 135 85 L 165 95 Z" fill="#F7F5F0" />
                  <path d="M 148 61 L 152 65 M 135 72 L 145 75" />
                  <path d="M 80 40 C 90 25 110 25 120 40" strokeDasharray="3 3" />
                </svg>
              </div>
              
              <h3 className="font-serif text-2xl text-[#131215] mb-2">This will cause a rejection.</h3>
              <p className="text-sm text-[#131215]/70 mb-6 leading-relaxed">
                Aadhaar: <span className="font-medium">{profile.panName}</span> &middot; UAN record: <span className="font-medium">{profile.name}</span> - EPFO rejects claims over exact-match failures like this.
              </p>
              <Link 
                href="/claims?fix=true"
                className="inline-flex min-h-[44px] items-center justify-center bg-[#2c524b] px-4 py-2 text-[10px] font-medium tracking-widest text-white uppercase transition-colors hover:bg-[#2c524b]/90 w-full"
              >
                Generate Joint Declaration
              </Link>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default function DashboardPage() {
  const { profile, scenario, setScenario, jdStatus } = useScenario();

  const employeeShare = 350000;
  const employerShare = 320000;
  const pensionShare = 105000;
  const totalBalance = employeeShare + employerShare + pensionShare;
  const pieData = [
    { name: "Employee", value: employeeShare },
    { name: "Employer", value: employerShare },
    { name: "Pension", value: pensionShare },
  ];

  const defaultFixPlan = "1. Launch the Auto-Fix workflow below to generate a digital Joint Declaration.\n2. We will automatically forward this to TechCorp India Pvt Ltd for their digital signature.\n3. Once approved, the field office will process your settlement without rejection.";
    
  const [aiFixPlan, setAiFixPlan] = useState<string>(defaultFixPlan);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [form13Status, setForm13Status] = useState("idle");
  const [nomineeStatus, setNomineeStatus] = useState("idle");

  const handleRegenerateLive = async () => {
    setIsAiLoading(true);
    const res = await fetchChatCompletion([{
      role: "user",
      content: "Generate a 3-step plain-English action plan for an Indian citizen to fix a name mismatch between their Aadhaar (Rahul Sharma) and EPFO UAN record (R. Sharma) so their PF withdrawal claim is not rejected. Number the steps. Be specific. Max 60 words total."
    }], 150);
    
    setAiFixPlan(res === "ERROR_API_FAILED" ? defaultFixPlan : res);
    setIsAiLoading(false);
  };

  const handleForm13 = () => {
    setForm13Status("submitting");
    setTimeout(() => {
      setForm13Status("success");
    }, 1500);
  };

  const handleNominee = () => {
    setNomineeStatus("submitting");
    setTimeout(() => {
      setNomineeStatus("success");
    }, 1500);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, index }: any) => {
    const RADIAN = Math.PI / 180;
    // Push the label slightly outside the slice for readability
    const radius = innerRadius + (outerRadius - innerRadius) * 1.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill={PIE_COLORS[index]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight={600}>
        {(value / 100000).toFixed(1)}L
      </text>
    );
  };

  return (
    <div className="space-y-12 pb-24">
      <header className="border-b border-[#131215]/10 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="font-serif text-4xl font-medium tracking-wide text-[#131215]">Hey, {profile.name.split(' ')[0]}.</h1>
            <p className="text-[10px] tracking-widest text-[#131215]/40 uppercase mt-2">Your Provident Fund, demystified.</p>
          </div>
          
          <div className="relative z-10">
            <select 
              value={scenario}
              onChange={(e) => {
                setScenario(e.target.value as any);
                setForm13Status("idle");
                setNomineeStatus("idle");
              }}
              className="appearance-none cursor-pointer bg-[#131215] text-[#F7F5F0] px-6 py-3 pr-10 text-[10px] font-medium tracking-widest uppercase rounded-sm border border-transparent hover:bg-[#131215]/90 transition-colors focus:outline-none"
            >
              <option value="CLEAN">Check: All Clear</option>
              <option value="MISMATCH">Check: Name Mismatch</option>
              <option value="MERGE">Check: Branch Merge</option>
              <option value="NOMINATION">Check: Missing Nomination</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#F7F5F0]">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </div>
        
        {/* Compact Activity Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-[10px] font-medium tracking-widest uppercase text-[#131215]/60">
          {scenario === "CLEAN" ? (
             <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-[#131215]/20" />
               <span>Ready to File &middot; Active Ledger</span>
             </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700">
              <div className="h-1.5 w-1.5 rounded-full bg-red-700 animate-pulse" />
              <span>Attention required before filing</span>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left Column - Big Data */}
        <div className="col-span-1 lg:col-span-2 space-y-12">
          
          {/* Balance */}
          <section>
            <p className="text-[10px] font-medium text-[#131215]/40 uppercase tracking-widest mb-4">Total Balance Breakdown</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-[#131215]/10 bg-white p-8">
              <div>
                <h2 className="font-serif text-5xl text-[#131215] tabular-nums mb-2">
                  Rs. {(totalBalance / 100000).toFixed(2)}L
                </h2>
                <span className="text-[9px] font-medium tracking-widest uppercase text-amber-700 border border-amber-700/20 bg-amber-50 px-1.5 py-0.5 rounded-sm inline-block mb-6">
                  (Simulated)
                </span>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#131215]/5 pb-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#131215]/60"><div className="w-2 h-2 bg-[#131215]"></div> Employee Share</div>
                    <div className="text-sm font-serif tabular-nums text-[#131215]">Rs. {employeeShare.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#131215]/5 pb-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#131215]/60"><div className="w-2 h-2 bg-[#2c524b]"></div> Employer Share</div>
                    <div className="text-sm font-serif tabular-nums text-[#131215]">Rs. {employerShare.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#131215]/60"><div className="w-2 h-2 bg-[#a3a3a3]"></div> Pension Contribution</div>
                    <div className="text-sm font-serif tabular-nums text-[#131215]">Rs. {pensionShare.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
              
              <div className="h-[200px] flex items-center justify-center ml-[-20px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={"cell-" + index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => ["Rs. " + Number(value).toLocaleString('en-IN'), undefined]}
                      contentStyle={{ backgroundColor: '#131215', border: 'none', borderRadius: '0px', color: '#F7F5F0', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* New Modules: Contributions & Claims to Track */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-8 border-t border-[#131215]/10">
            {/* Recent Contributions */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#131215]/40">
                  Recent Contributions
                </h3>
              </div>
              
              <div className="border border-[#131215]/10 bg-white">
                <div className="grid grid-cols-3 border-b border-[#131215]/5 px-4 py-3 bg-[#F7F5F0]">
                  <span className="text-[9px] uppercase tracking-widest text-[#131215]/40">Month</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#131215]/40 text-right">Employee</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#131215]/40 text-right">Employer</span>
                </div>
                {[
                  { month: "Aug", ee: "4,500", er: "4,500" },
                  { month: "Jul", ee: "4,500", er: "4,500" },
                  { month: "Jun", ee: "4,500", er: "4,500" },
                  { month: "May", ee: "4,500", er: "4,500" },
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-3 px-4 py-3 border-b border-[#131215]/5 last:border-b-0">
                    <span className="text-xs text-[#131215]/70 font-medium">{row.month}</span>
                    <span className="text-sm font-serif tabular-nums text-right text-[#131215]">Rs. {row.ee}</span>
                    <span className="text-sm font-serif tabular-nums text-right text-[#131215]/60">Rs. {row.er}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Claims to Track */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#131215]/40">
                  Claims to Track
                </h3>
              </div>
              
              <div className="border border-[#131215]/10 bg-white flex flex-col">
                <Link href="/claims" className="group flex items-center justify-between px-4 py-4 border-b border-[#131215]/5 hover:bg-[#F7F5F0] transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#131215] font-medium group-hover:text-[#2c524b] transition-colors">Form 19 (Final Settlement)</span>
                    <span className="text-[10px] font-mono text-[#131215]/40 uppercase tracking-widest">PF-98472-F19</span>
                  </div>
                  {scenario === "CLEAN" ? (
                    <span className="inline-flex px-2 py-0.5 border border-[#2c524b]/20 bg-[#2c524b]/5 text-[#2c524b] uppercase text-[9px] font-medium tracking-widest whitespace-nowrap">
                      Under Review
                    </span>
                  ) : scenario === "MISMATCH" ? (
                    <span className="inline-flex px-2 py-0.5 border border-red-700/20 bg-red-50 text-red-700 uppercase text-[9px] font-medium tracking-widest whitespace-nowrap">
                      Blocked
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 border border-amber-700/20 bg-amber-50 text-amber-900 uppercase text-[9px] font-medium tracking-widest whitespace-nowrap">
                      Missing Info
                    </span>
                  )}
                </Link>

                <Link href="/claims" className="group flex items-center justify-between px-4 py-4 hover:bg-[#F7F5F0] transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#131215] font-medium group-hover:text-[#2c524b] transition-colors">Form 31 (Advance)</span>
                    <span className="text-[10px] font-mono text-[#131215]/40 uppercase tracking-widest">PF-34221-F31</span>
                  </div>
                  <span className="inline-flex px-2 py-0.5 border border-[#131215]/10 text-[#131215]/60 uppercase text-[9px] font-medium tracking-widest whitespace-nowrap">
                    Settled
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Check Before Filing - Contextual Column */}
        <div className="col-span-1 flex flex-col">
          <p className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/40 mb-6 border-b border-[#131215]/10 pb-2">
            Check Before Filing
          </p>
          
          <div className="space-y-6">
            
            {scenario === "CLEAN" && (
              <div className="border border-[#131215]/10 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-[#2c524b]" />
                  <h3 className="font-serif text-xl text-[#131215]">All Clear</h3>
                </div>
                <p className="text-sm text-[#131215]/70 mb-6 leading-relaxed">
                  Your KYC is verified, Aadhaar is seeded, and service history is complete. You are ready to file a final settlement claim.
                </p>
                <Link 
                  href="/claims"
                  className="inline-flex min-h-[44px] items-center justify-center bg-[#2c524b] px-4 py-2 text-[10px] font-medium tracking-widest text-white uppercase transition-colors hover:bg-[#2c524b]/90 w-full"
                >
                  File Claim
                </Link>
              </div>
            )}

            {scenario === "MISMATCH" && (
              <PreClaimDiagnostic profile={profile} jdStatus={jdStatus} />
            )}

            {scenario === "MERGE" && (
              <div className="border border-[#131215]/10 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Share2 className="h-6 w-6 text-red-700" />
                  <h3 className="font-serif text-xl text-[#131215]">Service Overlap</h3>
                </div>
                <p className="text-sm text-[#131215]/70 mb-4 leading-relaxed">
                  We detected multiple unmerged PF accounts from previous employers (TCS Limited).
                </p>
                <div className="bg-[#F7F5F0] border border-[#131215]/10 p-4 mb-6 text-xs text-[#131215]/60 font-mono">
                  MH/BAN/1234567/000/9876543<br/>
                  MH/PUN/7654321/000/1234567 (Unmerged)
                </div>
                <p className="text-[10px] text-red-700 bg-red-50 p-2 border border-red-700/10 mb-6">
                  Filing Form 19 now will result in partial withdrawal. Transfer old funds via Form 13 first.
                </p>
                
                {form13Status === "idle" ? (
                  <button 
                    onClick={handleForm13}
                    className="inline-flex min-h-[44px] items-center justify-center border border-[#131215]/10 bg-transparent px-4 py-2 text-[10px] font-medium tracking-widest text-[#131215] uppercase transition-colors hover:bg-[#131215]/5 w-full"
                  >
                    Initiate Form 13 (Transfer)
                  </button>
                ) : form13Status === "submitting" ? (
                  <div className="flex min-h-[44px] items-center justify-center gap-2 border border-[#131215]/10 bg-[#131215]/5 text-[#131215]/40 text-[10px] font-medium tracking-widest uppercase">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-3 w-3 border-2 border-[#131215]/40 border-t-transparent rounded-full" />
                    Processing
                  </div>
                ) : (
                  <div className="flex min-h-[44px] flex-col items-center justify-center bg-[#2c524b]/5 border border-[#2c524b]/20 text-[#2c524b]">
                    <span className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase">
                      <CheckCircle2 className="h-3 w-3" /> Form 13 Submitted
                    </span>
                    <span className="text-[9px] mt-0.5 opacity-80">Pending Field Office Approval</span>
                  </div>
                )}
              </div>
            )}

            {scenario === "NOMINATION" && (
              <div className="border border-[#131215]/10 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-red-700" />
                  <h3 className="font-serif text-xl text-[#131215]">Missing e-Nomination</h3>
                </div>
                <p className="text-sm text-[#131215]/70 mb-4 leading-relaxed">
                  Your profile lacks a verified e-Nomination. EPFO now mandates e-Nomination for online claim filing.
                </p>
                <div className="bg-amber-50 border border-amber-700/20 p-4 mb-6 flex gap-3">
                  <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-900 leading-relaxed">
                    You cannot file Form 10C or Form 19 until a nominee is declared and digitally signed with Aadhaar.
                  </p>
                </div>
                
                {nomineeStatus === "idle" ? (
                  <button 
                    onClick={handleNominee}
                    className="inline-flex min-h-[44px] items-center justify-center bg-[#2c524b] px-4 py-2 text-[10px] font-medium tracking-widest text-white uppercase transition-colors hover:bg-[#2c524b]/90 w-full"
                  >
                    Add Nominee
                  </button>
                ) : nomineeStatus === "submitting" ? (
                  <div className="flex min-h-[44px] items-center justify-center gap-2 border border-[#2c524b] bg-[#2c524b]/90 text-white text-[10px] font-medium tracking-widest uppercase">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-3 w-3 border-2 border-white/60 border-t-transparent rounded-full" />
                    Connecting to e-Sign
                  </div>
                ) : (
                  <div className="flex min-h-[44px] flex-col items-center justify-center bg-[#2c524b]/5 border border-[#2c524b]/20 text-[#2c524b]">
                    <span className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase">
                      <CheckCircle2 className="h-3 w-3" /> Nominee Saved
                    </span>
                    <span className="text-[9px] mt-0.5 opacity-80">Aadhaar verification successful.</span>
                  </div>
                )}
              </div>
            )}
            
            {scenario === "MISMATCH" && jdStatus !== "success" && (
              <div className="mt-6 border border-[#131215]/10 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isAiLoading ? (
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="h-1.5 w-1.5 rounded-full bg-[#2c524b]" 
                      />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-[#2c524b]" />
                    )}
                    <h3 className="text-[10px] font-medium tracking-widest uppercase text-[#131215]">Saral Recommended Action</h3>
                  </div>
                </div>
                
                {isAiLoading ? (
                  <div className="space-y-2 animate-pulse mb-4">
                    <div className="h-2 w-full bg-[#131215]/10" />
                    <div className="h-2 w-5/6 bg-[#131215]/10" />
                    <div className="h-2 w-4/6 bg-[#131215]/10" />
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-[#131215]/80 whitespace-pre-line mb-4">
                    {aiFixPlan}
                  </p>
                )}
                
                <div className="flex items-center justify-between border-t border-[#131215]/10 pt-3">
                  <p className="text-[9px] uppercase tracking-widest text-[#131215]/40">
                    AI guidance — verify with official sources.
                  </p>
                  <button 
                    onClick={handleRegenerateLive}
                    disabled={isAiLoading}
                    className="text-[9px] uppercase tracking-widest text-[#2c524b] font-medium hover:opacity-70 transition-opacity"
                  >
                    Regenerate Live
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


