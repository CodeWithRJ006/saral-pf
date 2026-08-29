# Saral PF 🇮🇳

A modernized, AI-native redesign of the EPFO (Employees' Provident Fund Organisation) member portal. Saral PF is built to demystify provident fund management, proactively prevent claim rejections, and offer an ultra-clean, neo-brutalist interface for Indian citizens.

### 🟢 Live Demo
**Access the live application here:** [https://saral-pf.vercel.app/](https://saral-pf.vercel.app/)

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCodeWithRJ006%2Fsaral-pf)

---

## 🤝 Transparency & "How We Built This"

In the spirit of honesty and open engineering, I want to be completely transparent about how this project was brought to life for this hackathon. **This project was heavily co-created alongside AI:**

- **Code Generation & UI Writing:** The vast majority of the React components, Tailwind styling, and application logic were written using **OpenAI** models. 
- **Project Organization & Auditing:** I utilized **Codex** (and autonomous agentic coding frameworks) to organize the project structure, install required packages, self-audit for bugs, and implement dynamic changes across the codebase.
- **Visuals & Assets:** The beautiful, anonymous pixel-art illustrations featured on the login screen were generated entirely via **OpenAI (DALL-E)** to maintain strict UI compliance (no logos/text) while adding character and warmth to the neo-brutalist design language.

I acted as the architect, prompt engineer, and reviewer, guiding the AI to piece together a complex, beautiful, and functional application in record time.

---

## 🤖 The AI Engine (API Choice)

The platform features an intelligent chatbot and an "Auto-Fix" engine that drafts legal documents (like Joint Declarations and Form 13). 

**Current Live Demo:** 
To ensure the live demo stays up and responds instantly under heavy testing traffic, the live Next.js backend currently routes requests to the **Groq API** (using the qwen/qwen3.8-27b model). This prevents rate-limit crashes and keeps the UI snappy for judges and testers.

**Production Recommendation:**
The architecture is entirely provider-agnostic. For the absolute best response quality—especially for complex, multi-lingual EPFO policy questions—you can easily swap in an **OpenAI API Key** (e.g., gpt-4o) by simply changing the environment variable and endpoint. 

---

## ✨ Key Features

- **Pre-Claim Diagnostics**: Uses a custom mismatch engine to cross-reference UAN, PAN, and Aadhaar data *before* filing, drastically reducing rejection rates.
- **Contextual 'Check Before Filing' Modules**: Simulates realistic blockers like Name Mismatches, Service Overlaps (Branch Merges), and Missing e-Nominations.
- **AI-Powered Joint Declarations**: The built-in AI auto-fix agent instantly drafts official Joint Declarations, Form 13s, and grievance letters based on the exact mismatch context.
- **Real-Time LEDGER & Passbook**: Beautiful, tabular visualizations of your PF corpus (Employee, Employer, and EPS contributions).
- **Omni-Lingual Saral Assistant**: An omnipresent chatbot that knows your exact account state and can answer PF questions in English, Hindi, or Hinglish.

---

## 🏗️ Architecture Flow

`mermaid
graph TD
    A[User] --> B(Next.js Frontend)
    B --> C{Context Provider / Scenario Engine}
    
    C -->|Mock State| D[CLEAN]
    C -->|Mock State| E[MISMATCH]
    C -->|Mock State| F[MERGE]
    C -->|Mock State| G[NOMINATION]

    E --> H((Groq / OpenAI API))
    F --> H
    G --> H
    
    H -->|Generates| I[Auto-Fix Plan & Joint Declaration]
    H -->|Answers| Chat[Saral Omni-Chat]
    
    B --> J[Smart Dashboard]
    B --> K[Passbook Ledger]
    B --> L[Claims Tracker]
    B --> M[Grievance Engine]
`

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Framer Motion (Animations)
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

## 💻 Local Development

1. Clone the repository:
   \\\ash
   git clone https://github.com/CodeWithRJ006/saral-pf.git
   \\\
2. Install dependencies:
   \\\ash
   npm install
   \\\
3. Set up environment variables:
   Create a \.env.local\ file and add your API Key:
   \\\env
   GROQ_API_KEY=your_api_key_here
   # Or switch the endpoint in src/lib/openai.ts and use OPENAI_API_KEY
   \\\
4. Run the development server:
   \\\ash
   npm run dev
   \\\
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License

This project is built as a proof-of-concept/hackathon submission. All rights reserved.
