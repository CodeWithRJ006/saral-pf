"use client";

import { useScenario } from "@/context/ScenarioContext";
import { User, Bell, Lock, Smartphone, Mail, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SettingsPage() {
  const { profile } = useScenario();
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const [mobileState, setMobileState] = useState<"idle" | "editing" | "saving" | "success">("idle");
  const [pwdState, setPwdState] = useState<"idle" | "editing" | "saving" | "success">("idle");
  const [mockMobile, setMockMobile] = useState("+91 98****3210");

  const handleMobileSave = () => {
    setMobileState("saving");
    setTimeout(() => {
      setMockMobile("+91 88****1122");
      setMobileState("success");
      setTimeout(() => setMobileState("idle"), 2000);
    }, 1500);
  };

  const handlePwdSave = () => {
    setPwdState("saving");
    setTimeout(() => {
      setPwdState("success");
      setTimeout(() => setPwdState("idle"), 2000);
    }, 1500);
  };

  return (
    <div className="space-y-12 pb-24">
      <header className="border-b border-[#131215]/10 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="font-serif text-4xl font-medium tracking-wide text-[#131215]">Settings</h1>
            <p className="text-[10px] tracking-widest text-[#131215]/40 uppercase mt-2">Manage your preferences and security</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2 space-y-8">
          
          {/* Profile Setup */}
          <div className="border border-[#131215]/10 bg-white">
            <div className="p-6 border-b border-[#131215]/10 bg-[#F7F5F0] flex items-center gap-3">
              <User className="h-4 w-4 text-[#131215]/60" />
              <h3 className="text-sm font-medium tracking-widest uppercase text-[#131215]">Account Verification</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-[#131215]/5">
                <div>
                  <p className="text-sm font-medium text-[#131215]">Aadhaar Seeding</p>
                  <p className="text-xs text-[#131215]/60 mt-1">Linked to **** **** 8472</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-[#2c524b] bg-[#2c524b]/5 px-2 py-1 border border-[#2c524b]/20">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-6 border-b border-[#131215]/5">
                <div>
                  <p className="text-sm font-medium text-[#131215]">PAN Registration</p>
                  <p className="text-xs text-[#131215]/60 mt-1">Linked to {profile.pan}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-[#2c524b] bg-[#2c524b]/5 px-2 py-1 border border-[#2c524b]/20">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </div>
              </div>

              <div className="flex items-center justify-between min-h-[44px]">
                <div>
                  <p className="text-sm font-medium text-[#131215]">Registered Mobile</p>
                  {mobileState === "editing" ? (
                    <input type="text" defaultValue="" placeholder="New 10-digit number" className="mt-1 text-xs px-2 py-1 border border-[#131215]/20 focus:outline-none focus:border-[#2c524b]" autoFocus />
                  ) : (
                    <p className="text-xs text-[#131215]/60 mt-1">Linked to {mockMobile}</p>
                  )}
                </div>
                
                {mobileState === "idle" ? (
                  <button onClick={() => setMobileState("editing")} className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/60 hover:text-[#131215] transition-colors border border-[#131215]/20 px-3 py-1.5">
                    Change
                  </button>
                ) : mobileState === "editing" ? (
                  <div className="flex gap-2">
                    <button onClick={() => setMobileState("idle")} className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/40 hover:text-[#131215] transition-colors px-2">Cancel</button>
                    <button onClick={handleMobileSave} className="text-[10px] font-medium tracking-widest uppercase text-white bg-[#2c524b] transition-colors px-3 py-1.5">Save</button>
                  </div>
                ) : mobileState === "saving" ? (
                  <div className="text-[10px] font-medium tracking-widest uppercase text-[#2c524b] flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-3 w-3 border-2 border-[#2c524b]/60 border-t-transparent rounded-full" />
                    Updating
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-[#2c524b]">
                    <CheckCircle2 className="h-3 w-3" /> Updated
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="border border-[#131215]/10 bg-white">
            <div className="p-6 border-b border-[#131215]/10 bg-[#F7F5F0] flex items-center gap-3">
              <Bell className="h-4 w-4 text-[#131215]/60" />
              <h3 className="text-sm font-medium tracking-widest uppercase text-[#131215]">Alerts & Notifications</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-[#131215]/5">
                <div className="flex items-center gap-4">
                  <Smartphone className="h-5 w-5 text-[#131215]/40" />
                  <div>
                    <p className="text-sm font-medium text-[#131215]">SMS Alerts</p>
                    <p className="text-xs text-[#131215]/60 mt-1">Receive passbook updates and claim status via SMS</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSmsEnabled(!smsEnabled)}
                  className={"w-10 h-5 rounded-full relative transition-colors " + (smsEnabled ? "bg-[#2c524b]" : "bg-[#131215]/20")}
                >
                  <motion.div 
                    layout 
                    className="w-3 h-3 bg-white rounded-full absolute top-1"
                    initial={false}
                    animate={{ left: smsEnabled ? "22px" : "4px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-[#131215]/40" />
                  <div>
                    <p className="text-sm font-medium text-[#131215]">Email Updates</p>
                    <p className="text-xs text-[#131215]/60 mt-1">Receive monthly e-passbook on your registered email</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEmailEnabled(!emailEnabled)}
                  className={"w-10 h-5 rounded-full relative transition-colors " + (emailEnabled ? "bg-[#2c524b]" : "bg-[#131215]/20")}
                >
                  <motion.div 
                    layout 
                    className="w-3 h-3 bg-white rounded-full absolute top-1"
                    initial={false}
                    animate={{ left: emailEnabled ? "22px" : "4px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="border border-[#131215]/10 bg-white">
            <div className="p-6 border-b border-[#131215]/10 bg-[#F7F5F0] flex items-center gap-3">
              <Lock className="h-4 w-4 text-[#131215]/60" />
              <h3 className="text-sm font-medium tracking-widest uppercase text-[#131215]">Security</h3>
            </div>
            <div className="p-6 flex items-center justify-between min-h-[80px]">
              <div>
                <p className="text-sm font-medium text-[#131215]">Account Password</p>
                {pwdState === "editing" ? (
                  <div className="mt-2 space-y-2">
                    <input type="password" placeholder="Current Password" className="block text-xs px-2 py-1.5 border border-[#131215]/20 focus:outline-none focus:border-[#2c524b]" />
                    <input type="password" placeholder="New Password" className="block text-xs px-2 py-1.5 border border-[#131215]/20 focus:outline-none focus:border-[#2c524b]" />
                  </div>
                ) : pwdState === "success" ? (
                   <p className="text-xs text-[#2c524b] mt-1 font-medium">Password successfully changed!</p>
                ) : (
                  <p className="text-xs text-[#131215]/60 mt-1">Last changed 45 days ago</p>
                )}
              </div>
              
              <div className="self-start">
                {pwdState === "idle" ? (
                  <button onClick={() => setPwdState("editing")} className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/60 hover:text-[#131215] transition-colors border border-[#131215]/20 px-3 py-1.5">
                    Update
                  </button>
                ) : pwdState === "editing" ? (
                  <div className="flex gap-2">
                    <button onClick={() => setPwdState("idle")} className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/40 hover:text-[#131215] transition-colors px-2">Cancel</button>
                    <button onClick={handlePwdSave} className="text-[10px] font-medium tracking-widest uppercase text-white bg-[#2c524b] transition-colors px-3 py-1.5">Save</button>
                  </div>
                ) : pwdState === "saving" ? (
                  <div className="text-[10px] font-medium tracking-widest uppercase text-[#2c524b] flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-3 w-3 border-2 border-[#2c524b]/60 border-t-transparent rounded-full" />
                    Updating
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-[#2c524b]">
                    <CheckCircle2 className="h-3 w-3" /> Updated
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
