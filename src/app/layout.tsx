import type { Metadata } from "next";
import { Inter_Tight, Fraunces } from "next/font/google";
import "./globals.css";
import { ScenarioProvider } from "@/context/ScenarioContext";

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", weight: ["400", "500", "600"] });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Saral PF",
  description: "EPFO 3.0 Command Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} ${fraunces.variable} font-sans min-h-screen bg-[#F7F5F0] text-[#131215] antialiased selection:bg-[#2c524b]/20 selection:text-[#2c524b]`}>
        <ScenarioProvider>
          {children}
          <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#131215] py-1.5 px-4 text-center pointer-events-none flex items-center justify-center">
            <p className="text-[8.5px] font-medium tracking-widest uppercase text-[#F7F5F0]/90">
              Demo Prototype — AI-generated guidance & mock data must be verified with official EPFO sources.
            </p>
          </div>
        </ScenarioProvider>
      </body>
    </html>
  );
}
