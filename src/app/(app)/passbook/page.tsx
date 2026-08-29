"use client";

import { useScenario } from "@/context/ScenarioContext";
import { Download, Filter, Building2, Calendar, CheckCircle2, FileSpreadsheet, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function PassbookPage() {
  const { profile } = useScenario();
  const [pdfDownloadState, setPdfDownloadState] = useState<"idle" | "downloading" | "success">("idle");
  const [excelDownloadState, setExcelDownloadState] = useState<"idle" | "downloading" | "success">("idle");
  const [showOlder, setShowOlder] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("Filter Year");

  const transactions = [
    { month: "Aug 2026", ee: 4500, er: 3250, eps: 1250, desc: "Contribution for Jul 2026" },
    { month: "Jul 2026", ee: 4500, er: 3250, eps: 1250, desc: "Contribution for Jun 2026" },
    { month: "Jun 2026", ee: 4500, er: 3250, eps: 1250, desc: "Contribution for May 2026" },
    { month: "May 2026", ee: 4500, er: 3250, eps: 1250, desc: "Contribution for Apr 2026" },
    { month: "Apr 2026", ee: 4500, er: 3250, eps: 1250, desc: "Contribution for Mar 2026" },
    { month: "Mar 2026", ee: 4200, er: 2950, eps: 1250, desc: "Contribution for Feb 2026" },
  ];

  const olderTransactions = [
    { month: "Feb 2026", ee: 4200, er: 2950, eps: 1250, desc: "Contribution for Jan 2026" },
    { month: "Jan 2026", ee: 4200, er: 2950, eps: 1250, desc: "Contribution for Dec 2025" },
    { month: "Dec 2025", ee: 4000, er: 2800, eps: 1200, desc: "Contribution for Nov 2025" },
    { month: "Nov 2025", ee: 4000, er: 2800, eps: 1200, desc: "Contribution for Oct 2025" },
    { month: "Oct 2025", ee: 4000, er: 2800, eps: 1200, desc: "Contribution for Sep 2025" },
  ];

  const allTx = [...transactions, ...olderTransactions];

  const handleDownloadPDF = () => {
    setPdfDownloadState("downloading");
    
    setTimeout(() => {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Member Passbook", 14, 22);
      
      doc.setFontSize(10);
      doc.text(UAN: \, 14, 32);
      doc.text(Name: \, 14, 38);
      doc.text(Employer: TechCorp India Pvt Ltd, 14, 44);
      
      let currentBalance = 670000;
      
      const tableData = allTx.map(tx => {
        const row = [
          tx.month,
          tx.desc,
          Rs. \,
          Rs. \,
          Rs. \
        ];
        currentBalance -= (tx.ee + tx.er);
        return row;
      });
      
      autoTable(doc, {
        startY: 52,
        head: [["Month", "Description", "Employee (EE)", "Employer (ER)", "Balance"]],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [44, 82, 75] },
        styles: { fontSize: 8 },
      });
      
      doc.save(EPFO_Passbook_\.pdf);
      
      setPdfDownloadState("success");
      setTimeout(() => setPdfDownloadState("idle"), 3000);
    }, 800);
  };

  const handleDownloadExcel = () => {
    setExcelDownloadState("downloading");
    
    setTimeout(() => {
      let currentBalance = 670000;
      const excelData = allTx.map(tx => {
        const row = {
          "Transaction Date": tx.month,
          "Description": tx.desc,
          "Employee Contribution": tx.ee,
          "Employer Contribution": tx.er,
          "Running Balance": currentBalance
        };
        currentBalance -= (tx.ee + tx.er);
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const range = XLSX.utils.decode_range(worksheet['!ref'] || "A1:E1");
      
      worksheet['!views'] = [{ state: 'frozen', ySplit: 1 }];
      
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const headerAddress = XLSX.utils.encode_col(C) + "1";
        if (worksheet[headerAddress]) {
          worksheet[headerAddress].s = { font: { bold: true } };
        }
        
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          const cellAddress = XLSX.utils.encode_cell({r: R, c: C});
          if (!worksheet[cellAddress]) continue;
          if (C >= 2) {
            worksheet[cellAddress].z = '"₹"#,##0.00';
          }
        }
      }

      worksheet['!cols'] = [
        { wch: 18 },
        { wch: 35 },
        { wch: 22 },
        { wch: 22 },
        { wch: 20 }
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Passbook");
      XLSX.writeFile(workbook, EPFO_Passbook_\.xlsx);
      
      setExcelDownloadState("success");
      setTimeout(() => setExcelDownloadState("idle"), 3000);
    }, 800);
  };

  return (
    <div className="space-y-12 pb-24">
      <header className="border-b border-[#131215]/10 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="font-serif text-4xl font-medium tracking-wide text-[#131215]">Member Passbook</h1>
            <p className="text-[10px] tracking-widest text-[#131215]/40 uppercase mt-2">UAN: {profile.uan}</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleDownloadPDF}
              disabled={pdfDownloadState !== "idle"}
              className="flex-1 sm:flex-none inline-flex items-center gap-2 bg-white border border-[#131215]/20 text-[#131215] px-4 py-3 text-[10px] font-medium tracking-widest uppercase rounded-sm hover:bg-[#F7F5F0] transition-colors disabled:opacity-80 min-w-[140px] justify-center"
            >
              {pdfDownloadState === "downloading" ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-3 w-3 border-2 border-[#131215]/60 border-t-transparent rounded-full" /> PDF...</>
              ) : pdfDownloadState === "success" ? (
                <><CheckCircle2 className="h-3 w-3 text-green-600" /> PDF Saved</>
              ) : (
                <><FileText className="h-3 w-3" /> Export PDF</>
              )}
            </button>
            <button 
              onClick={handleDownloadExcel}
              disabled={excelDownloadState !== "idle"}
              className="flex-1 sm:flex-none inline-flex items-center gap-2 bg-[#2c524b] text-white px-4 py-3 text-[10px] font-medium tracking-widest uppercase rounded-sm hover:bg-[#1e3b35] transition-colors disabled:opacity-80 min-w-[140px] justify-center"
            >
              {excelDownloadState === "downloading" ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-3 w-3 border-2 border-white/60 border-t-transparent rounded-full" /> Excel...</>
              ) : excelDownloadState === "success" ? (
                <><CheckCircle2 className="h-3 w-3 text-green-400" /> Excel Saved</>
              ) : (
                <><FileSpreadsheet className="h-3 w-3" /> Export Excel</>
              )}
            </button>
          </div>
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
            
            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase text-[#131215]/60 hover:text-[#131215] transition-colors"
              >
                <Filter className="h-3 w-3" /> {selectedYear}
              </button>
              
              <AnimatePresence>
                {filterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-full mt-2 w-32 bg-white border border-[#131215]/10 shadow-xl z-10"
                  >
                    {["All Years", "2026-2027", "2025-2026", "2024-2025"].map(yr => (
                      <button 
                        key={yr}
                        onClick={() => {
                          setSelectedYear(yr);
                          setFilterOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-xs text-[#131215]/80 hover:bg-[#F7F5F0] hover:text-[#131215] transition-colors"
                      >
                        {yr}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                
                <AnimatePresence>
                  {showOlder && olderTransactions.map((tx, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={"older-" + idx} 
                      className="border-b border-[#131215]/5 hover:bg-[#F7F5F0]/50 transition-colors bg-[#F7F5F0]/20"
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
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-[#131215]/10 text-center">
            <button 
              onClick={() => setShowOlder(!showOlder)}
              className="text-[10px] font-medium tracking-widest uppercase text-[#2c524b] hover:opacity-80 transition-opacity"
            >
              {showOlder ? "Hide Older Transactions" : "View Older Transactions"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
