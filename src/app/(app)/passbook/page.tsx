"use client";

import { useScenario } from "@/context/ScenarioContext";
import { Download, Filter, Building2, Calendar, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function PassbookPage() {
  const { profile } = useScenario();
  const [downloadState, setDownloadState] = useState<"idle" | "downloading" | "success">("idle");

  const handleDownload = () => {
    setDownloadState("downloading");
    setTimeout(() => {
      setDownloadState("success");
      setTimeout(() => setDownloadState("idle"), 3000);
    }, 2000);
  };

  const transactions = [
    { month: "Aug 2026", ee: 4500, er: 3250, eps: 1250, desc: "Contribution for Jul 2026" },
    { month: "Jul 2026", ee: 4500, er: 3250, eps: 1250, desc: "Contribution for Jun 2026" },
    { month: "Jun 2026", ee: 4500, er: 3250, eps: 1250, desc: "Contribution for May 2026" },
    { month: "May 2026", ee: 4500, er: 3250, eps: 1250, desc: "Contribution for Apr 2026" },
    { month: "Apr 2026", ee: 4500, er: 3250, eps: 1250, desc: "Contribution for Mar 2026" },
    { month: "Mar 2026", ee: 4200, er: 2950, eps: 1250, desc: "Contribution for Feb 2026" },
  ];

  return (
    <div className="space-y-12 pb-24">
      <header className="border-b border-[#131215]/10 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="font-serif text-4xl font-medium tracking-wide text-[#131215]">Member Passbook</h1>
            <p className="text-[10px] tracking-widest text-[#131215]/40 uppercase mt-2">UAN: {profile.uan}</p>
          </div>
          
          <button 
            onClick={handleDownload}
            disabled={downloadState !== "idle"}
            className="inline-flex items-center gap-2 bg-[#131215] text-[#F7F5F0] px-6 py-3 text-[10px] font-medium tracking-widest uppercase rounded-sm hover:bg-[#131215]/90 transition-colors disabled:opacity-80 w-[160px] justify-center"
          >
            {downloadState === "downloading" ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-3 w-3 border-2 border-[#F7F5F0]/60 border-t-transparent rounded-full" />
                Generating...
              </>
            ) : downloadState === "success" ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-green-400" />
                Downloaded
              </>
            ) : (
              <>
                <Download className="h-3 w-3" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="col-span-1 lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[#131215]/10 bg-white p-6">
            <p className="text-[10px] uppercase tracking-widest text-[#131215]/60 mb-2">Employee Share</p>
            <p className="font-serif text-3xl text-[#131215] tabular-nums">Rs. 3,50,000</p>
          </div>
          <div className="border border-[#131215]/10 bg-white p-6">
            <p className="text-[10px] uppercase tracking-widest text-[#131215]/60 mb-2">Employer Share</p>
            <p className="font-serif text-3xl text-[#2c524b] tabular-nums">Rs. 3,20,000</p>
          </div>
          <div className="border border-[#131215]/10 bg-white p-6">
            <p className="text-[10px] uppercase tracking-widest text-[#131215]/60 mb-2">Pension (EPS)</p>
            <p className="font-serif text-3xl text-[#a3a3a3] tabular-nums">Rs. 1,05,000</p>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-4 border border-[#131215]/10 bg-white">
          <div className="flex items-center justify-between p-6 border-b border-[#131215]/10 bg-[#F7F5F0]">
            <div className="flex items-center gap-2 text-[#131215]">
              <Building2 className="h-4 w-4" />
              <span className="font-medium text-sm">TechCorp India Pvt Ltd</span>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase text-[#131215]/60 hover:text-[#131215] transition-colors">
              <Filter className="h-3 w-3" /> Filter Year
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#131215]/10 text-[10px] uppercase tracking-widest text-[#131215]/40">
                  <th className="p-4 font-medium whitespace-nowrap">Transaction Month</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium text-right">Employee (EE)</th>
                  <th className="p-4 font-medium text-right">Employer (ER)</th>
                  <th className="p-4 font-medium text-right">Pension (EPS)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transactions.map((tx, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx} 
                    className="border-b border-[#131215]/5 hover:bg-[#F7F5F0]/50 transition-colors"
                  >
                    <td className="p-4 whitespace-nowrap text-[#131215]/80 font-medium flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-[#131215]/40" />
                      {tx.month}
                    </td>
                    <td className="p-4 text-[#131215]/60 text-xs">{tx.desc}</td>
                    <td className="p-4 text-right font-serif tabular-nums text-[#131215]">Rs. {tx.ee.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-right font-serif tabular-nums text-[#2c524b]">Rs. {tx.er.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-right font-serif tabular-nums text-[#a3a3a3]">Rs. {tx.eps.toLocaleString('en-IN')}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-[#131215]/10 text-center">
            <button className="text-[10px] font-medium tracking-widest uppercase text-[#2c524b] hover:opacity-80 transition-opacity">
              View Older Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
