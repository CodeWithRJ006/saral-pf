"use client";

import { useScenario } from "@/context/ScenarioContext";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { profile, scenario } = useScenario();

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <header className="border-b border-[#131215]/10 pb-8">
        <p className="text-[10px] tracking-widest text-[#131215]/40 uppercase mb-2">Member Profile</p>
        <h1 className="font-serif text-4xl font-medium tracking-wide text-[#131215] mb-4">
          Personal Information
        </h1>
        <p className="text-sm text-[#131215]/60 max-w-2xl">
          Unified Member Portal summary. Ensure your KYC details perfectly match your UAN records to avoid claim rejections.
        </p>
      </header>

      {/* Basic Details Grid */}
      <section className="space-y-6">
        <h2 className="text-[10px] tracking-widest text-[#131215]/40 uppercase">Basic Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 bg-white p-6 md:p-8 border border-[#131215]/10">
          <div className="border-l border-[#131215]/20 pl-4 py-1">
            <p className="text-[10px] font-medium text-[#131215]/40 uppercase tracking-widest mb-1">UAN</p>
            <p className="text-sm font-mono tracking-wide text-[#131215]">{profile.uan}</p>
          </div>
          <div className="border-l border-[#131215]/20 pl-4 py-1">
            <p className="text-[10px] font-medium text-[#131215]/40 uppercase tracking-widest mb-1">Name</p>
            <p className="text-sm font-medium text-[#131215]">{profile.name}</p>
          </div>
          <div className="border-l border-[#131215]/20 pl-4 py-1">
            <p className="text-[10px] font-medium text-[#131215]/40 uppercase tracking-widest mb-1">Date of Birth</p>
            <p className="text-sm font-medium text-[#131215]">14 Oct 1991</p>
          </div>
          <div className="border-l border-[#131215]/20 pl-4 py-1">
            <p className="text-[10px] font-medium text-[#131215]/40 uppercase tracking-widest mb-1">Gender</p>
            <p className="text-sm font-medium text-[#131215]">Male</p>
          </div>
          <div className="border-l border-[#131215]/20 pl-4 py-1">
            <p className="text-[10px] font-medium text-[#131215]/40 uppercase tracking-widest mb-1">Father's Name</p>
            <p className="text-sm font-medium text-[#131215]">S. K. {profile.name.split(' ')[1] || 'Sharma'}</p>
          </div>
          <div className="border-l border-[#131215]/20 pl-4 py-1">
            <p className="text-[10px] font-medium text-[#131215]/40 uppercase tracking-widest mb-1">Marital Status</p>
            <p className="text-sm font-medium text-[#131215]">Single</p>
          </div>
          <div className="border-l border-[#131215]/20 pl-4 py-1">
            <p className="text-[10px] font-medium text-[#131215]/40 uppercase tracking-widest mb-1">Mobile</p>
            <p className="text-sm font-medium text-[#131215]">+91 98765 43210</p>
          </div>
          <div className="border-l border-[#131215]/20 pl-4 py-1">
            <p className="text-[10px] font-medium text-[#131215]/40 uppercase tracking-widest mb-1">Email</p>
            <p className="text-sm font-medium text-[#131215]">member@example.com</p>
          </div>
        </div>
      </section>

      {/* KYC Details */}
      <section className="space-y-6">
        <h2 className="text-[10px] tracking-widest text-[#131215]/40 uppercase">KYC & seeded documents</h2>
        
        <div className="border border-[#131215]/10 bg-white p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Aadhaar */}
            <div className="flex flex-col gap-4 border border-[#131215]/5 p-5 bg-[#F7F5F0]/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-medium text-[#131215]/40">Aadhaar</span>
                <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-[#2c524b] font-medium px-2 py-1 bg-[#2c524b]/5 border border-[#2c524b]/20">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              </div>
              <div>
                <p className="text-sm font-mono tracking-widest text-[#131215] mb-1">XXXX XXXX 4012</p>
                <p className="text-xs text-[#131215]/60">Name: {profile.panName}</p>
              </div>
              {scenario === 'MISMATCH' && (
                <div className="mt-2 text-[10px] text-red-700 bg-red-50 p-2 border border-red-700/10 flex gap-2">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  Name mismatch detected against UAN record.
                </div>
              )}
            </div>

            {/* PAN */}
            <div className="flex flex-col gap-4 border border-[#131215]/5 p-5 bg-[#F7F5F0]/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-medium text-[#131215]/40">PAN</span>
                <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-[#2c524b] font-medium px-2 py-1 bg-[#2c524b]/5 border border-[#2c524b]/20">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              </div>
              <div>
                <p className="text-sm font-mono tracking-widest text-[#131215] mb-1">{profile.pan}</p>
                <p className="text-xs text-[#131215]/60">Name: {profile.panName}</p>
              </div>
            </div>

            {/* Bank */}
            <div className="flex flex-col gap-4 border border-[#131215]/5 p-5 bg-[#F7F5F0]/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-medium text-[#131215]/40">Bank Account</span>
                <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-[#2c524b] font-medium px-2 py-1 bg-[#2c524b]/5 border border-[#2c524b]/20">
                  <CheckCircle2 className="h-3 w-3" /> Digitally Signed
                </span>
              </div>
              <div>
                <p className="text-sm font-mono tracking-widest text-[#131215] mb-1">XXXXXXXX4012</p>
                <p className="text-xs text-[#131215]/60">HDFC Bank Ltd &middot; HDFC0001234</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Service History */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] tracking-widest text-[#131215]/40 uppercase">Service History</h2>
          <span className="text-[9px] font-medium tracking-widest uppercase text-amber-700 border border-amber-700/20 bg-amber-50 px-1.5 py-0.5 rounded-sm">
            (Simulated)
          </span>
        </div>
        
        <div className="border border-[#131215]/10 bg-white">
          {/* Current Employer */}
          <div className="p-6 md:p-8 border-b border-[#131215]/10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-serif text-[#131215] font-medium">TechCorp India Pvt Ltd</h3>
                <p className="text-xs text-[#131215]/60 font-mono mt-1">MH/BAN/1234567/000/9876543</p>
              </div>
              <span className="inline-flex px-2 py-0.5 border border-[#2c524b]/20 bg-[#2c524b]/5 text-[#2c524b] uppercase text-[9px] font-medium tracking-widest">
                Active
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] text-[#131215]/40 uppercase tracking-widest mb-1">DOJ (EPF)</p>
                <p className="text-sm text-[#131215] font-medium">12 Jan 2021</p>
              </div>
              <div>
                <p className="text-[10px] text-[#131215]/40 uppercase tracking-widest mb-1">DOJ (EPS)</p>
                <p className="text-sm text-[#131215] font-medium">12 Jan 2021</p>
              </div>
              <div>
                <p className="text-[10px] text-[#131215]/40 uppercase tracking-widest mb-1">DOE (EPF)</p>
                <p className="text-sm text-[#131215]/40 font-medium">Not Available</p>
              </div>
              <div>
                <p className="text-[10px] text-[#131215]/40 uppercase tracking-widest mb-1">Total Balance</p>
                <p className="text-sm text-[#131215] font-serif tabular-nums font-medium">Rs. 7,75,000</p>
              </div>
            </div>
          </div>

          {/* Previous Employer */}
          <div className="p-6 md:p-8 bg-[#F7F5F0]/30 opacity-80">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-serif text-[#131215] font-medium">TCS Limited</h3>
                <p className="text-xs text-[#131215]/60 font-mono mt-1">MH/PUN/7654321/000/1234567</p>
              </div>
              <span className="inline-flex px-2 py-0.5 border border-[#131215]/10 text-[#131215]/60 uppercase text-[9px] font-medium tracking-widest">
                Closed
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] text-[#131215]/40 uppercase tracking-widest mb-1">DOJ (EPF)</p>
                <p className="text-sm text-[#131215] font-medium">01 Mar 2018</p>
              </div>
              <div>
                <p className="text-[10px] text-[#131215]/40 uppercase tracking-widest mb-1">DOE (EPF)</p>
                <p className="text-sm text-[#131215] font-medium">05 Jan 2021</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-[#131215]/40 uppercase tracking-widest mb-1">Transfer Status</p>
                <p className="text-sm text-[#2c524b] font-medium">Funds transferred successfully (Form 13)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
