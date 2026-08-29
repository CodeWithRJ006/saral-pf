"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [uan, setUan] = useState("100984729100");
  const [otp, setOtp] = useState("123456");
  const [step, setStep] = useState<"input" | "authenticating" | "success">("input");

  const handleStartAuth = () => {
    setStep("authenticating");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }, 2000);
  };

  const cubicTransition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div className="flex min-h-screen bg-[#F7F5F0] text-[#131215] lg:grid lg:grid-cols-2">
      
      {/* Left Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-[360px]">
          <AnimatePresence mode="popLayout">
            {step === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={cubicTransition}
                className="flex flex-col gap-10"
              >
                
                {/* Disclosure Banner */}
                <div className="flex justify-center mb-4">
                  <div className="inline-block border border-[#131215]/10 px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#131215]/60 text-center">
                    Demo prototype â€” enter any 12-digit UAN and any 6-digit OTP to explore.
                  </div>
                </div>

                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#131215]" />
                  </div>
                  <h2 className="font-serif text-4xl italic font-medium tracking-tight text-[#131215]">Saral.</h2>
                  <p className="text-[10px] tracking-widest text-[#131215]/60 uppercase">Secure Gateway</p>
                </div>

                <div className="space-y-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-medium text-[#131215]/60 uppercase tracking-widest">
                        Universal Account Number
                      </label>
                      <span className="text-[10px] font-medium tracking-widest text-[#131215]/40 tabular-nums">
                        {uan.length}/12
                      </span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={uan}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setUan(val);
                      }}
                      className="w-full min-h-[44px] rounded-none border-b border-[#131215]/20 bg-transparent py-2 text-lg font-serif tabular-nums text-[#131215] placeholder-[#131215]/20 outline-none transition-colors focus:border-[#2c524b]"
                      placeholder="1009 8472 9100"
                    />
                    <p className="text-xs text-[#131215]/40 mt-1">
                      Your Universal Account Number is on your payslip or the EPFO member portal.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-medium text-[#131215]/60 uppercase tracking-widest">
                      One-Time Password
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full min-h-[44px] rounded-none border-b border-[#131215]/20 bg-transparent py-2 text-lg font-serif tabular-nums text-[#131215] placeholder-[#131215]/20 outline-none transition-colors focus:border-[#2c524b]"
                      placeholder="123 456"
                    />
                    <p className="text-xs text-[#131215]/40 mt-1">
                      A 6-digit OTP would be sent to your Aadhaar-linked mobile in the real system.
                    </p>
                  </div>

                  <button
                    onClick={handleStartAuth}
                    disabled={uan.length !== 12}
                    className="w-full min-h-[44px] border border-[#2c524b] px-4 py-4 text-xs font-medium tracking-widest text-white bg-[#2c524b] uppercase transition-colors hover:bg-[#1e3b35] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <span>Authenticate</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === "authenticating" && (
              <motion.div
                key="authenticating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={cubicTransition}
                className="flex flex-col items-center justify-center py-10 text-center min-h-[400px]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center bg-[#F7F5F0] border border-[#131215]/10">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="h-2 w-2 rounded-full bg-[#2c524b]" 
                  />
                </div>
                <h3 className="font-serif text-xl tracking-wide text-[#131215]">Authenticating</h3>
                <p className="mt-2 text-[10px] tracking-widest uppercase text-[#131215]/60">Verifying credentials</p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={cubicTransition}
                className="flex flex-col items-center justify-center py-10 text-center min-h-[400px]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center bg-[#131215]">
                  <div className="h-2 w-2 rounded-full bg-[#F7F5F0]" />
                </div>
                <h3 className="font-serif text-xl tracking-wide text-[#131215]">Verified</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Visual Side - Pixel Art Vibe */}
      <div className="hidden lg:flex relative flex-1 overflow-hidden border-l border-[#131215]/10 group">
        
        {/* Animated Pixel Art Background */}
        <motion.div 
          animate={{ scale: [1, 1.02, 1], x: [0, -10, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[url('/illustrations/epfo_pixel_bg_notext.jpg')] bg-cover bg-bottom"
          style={{ imageRendering: "pixelated" }}
        />

        {/* Pixel "Overlay Particles" to simulate live gif feel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-overlay opacity-20">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: ["0vh", "100vh"], 
                x: [0, i % 2 === 0 ? 30 : -30, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                y: { duration: 15 + i * 3, repeat: Infinity, ease: "linear" },
                x: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 15 + i * 3, repeat: Infinity, ease: "linear" }
              }}
              className="absolute w-2 h-2 bg-[#2c524b]/40 backdrop-blur-sm"
              style={{ left: `${15 * i}%`, top: "-10%" }}
            />
          ))}
        </div>

        {/* Re-positioned Info Card - Small, Bottom Left, so it doesn't block art */}
        <div className="absolute bottom-8 left-8 z-10 w-full max-w-sm">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="bg-[#F7F5F0]/90 backdrop-blur-xl border border-[#131215]/10 p-6 shadow-2xl rounded-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
                <span className="text-[9px] font-medium uppercase tracking-widest text-red-600">Rejection Crisis</span>
              </div>
              <span className="text-[8px] font-medium tracking-widest text-[#131215]/40 uppercase">
                Source: Indian Express
              </span>
            </div>
            
            <h2 className="font-serif text-2xl text-[#131215] leading-[1.2] mb-4">
              Nearly 1 in 3 EPF claims get rejected.
            </h2>
            
            <p className="text-xs text-[#131215]/70 mb-6 leading-relaxed">
              Most rejections come down to something as small as one letter not matching between Aadhaar and UAN records.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#131215]/10">
              <div>
                <p className="font-serif text-xl text-[#131215] mb-1 tabular-nums">34%</p>
                <p className="text-[8px] font-medium tracking-widest uppercase text-[#131215]/40">National Rate</p>
              </div>
              <div>
                <p className="font-serif text-xl text-[#2c524b] mb-1 tabular-nums">0%</p>
                <p className="text-[8px] font-medium tracking-widest uppercase text-[#131215]/40">With Saral</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}

