"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type ScenarioType = "CLEAN" | "MISMATCH" | "MERGE" | "NOMINATION";
export type JdStatus = "idle" | "submitting" | "success";

interface Profile {
  name: string;
  uan: string;
  pan: string;
  aadhaarLinked: boolean;
  panName: string;
}

interface ScenarioContextType {
  scenario: ScenarioType;
  setScenario: (s: ScenarioType) => void;
  profile: Profile;
  jdStatus: JdStatus;
  setJdStatus: (status: JdStatus) => void;
}

const profiles: Record<ScenarioType, Profile> = {
  CLEAN: {
    name: "Sneha Patel",
    uan: "1009 8472 9100",
    pan: "ABCDE1234F",
    aadhaarLinked: true,
    panName: "Sneha Patel",
  },
  MISMATCH: {
    name: "Rahul Verma",
    uan: "1009 8472 9100",
    pan: "VWXYZ9876Q",
    aadhaarLinked: true,
    panName: "Rahul S. Verma", // The mismatch
  },
  MERGE: {
    name: "Amit Kumar",
    uan: "1008 7654 3210",
    pan: "KLMNO5678P",
    aadhaarLinked: true,
    panName: "Amit Kumar",
  },
  NOMINATION: {
    name: "Priya Mehta",
    uan: "1007 6543 2109",
    pan: "QRSTU3456N",
    aadhaarLinked: true,
    panName: "Priya Mehta",
  }
};

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<ScenarioType>("CLEAN");
  const [jdStatus, setJdStatus] = useState<JdStatus>("idle");

  // Reset JD status if scenario changes
  useEffect(() => {
    setJdStatus("idle");
  }, [scenario]);

  return (
    <ScenarioContext.Provider value={{ scenario, setScenario, profile: profiles[scenario], jdStatus, setJdStatus }}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const context = useContext(ScenarioContext);
  if (!context) throw new Error("useScenario must be used within ScenarioProvider");
  return context;
}
