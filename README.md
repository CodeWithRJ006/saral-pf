# Saral PF

A modernized, AI-native redesign of the EPFO (Employees' Provident Fund Organisation) member portal, built to demystify provident fund management, prevent claim rejections, and offer an ultra-clean, neo-brutalist interface.

## 🚀 Key Features

- **Pre-Claim Diagnostics**: Uses a custom mismatch engine to cross-reference UAN, PAN, and Aadhaar data *before* filing, drastically reducing rejection rates.
- **Contextual 'Check Before Filing' Modules**: Simulates realistic blockers like Name Mismatches, Service Overlaps (Branch Merges), and Missing e-Nominations.
- **AI-Powered Joint Declarations**: The built-in AI auto-fix agent instantly drafts official Joint Declarations and grievance letters based on the exact mismatch context.
- **Real-Time LEDGER & Passbook**: Beautiful, tabular visualizations of your PF corpus (Employee, Employer, and EPS contributions) powered by Recharts.
- **EPFiGMS Integration**: A streamlined mock grievance submission UI to track and resolve blocked claims.

## 🧠 AI Integration

- **LLM Auto-Fix Agent (OpenAI & Codex)**: The core recommendation engine and Joint Declaration generator is powered by OpenAI. It analyzes the specific mismatch criteria (e.g., Aadhaar name vs UAN name) and generates a 3-step actionable plan along with a correctly formatted legal document to submit to the field office.
- **Pixel Art Visuals (OpenAI / DALL-E)**: The beautiful, anonymous pixel-art illustrations featured on the login screen were generated via AI to maintain strict UI compliance (no logos/text) while adding character and warmth to the neo-brutalist design language.

## 🏗️ Architecture Flow

\\\mermaid
graph TD
    A[User] --> B(Next.js Frontend)
    B --> C{Context Provider / Scenario Engine}
    
    C -->|Mock State| D[CLEAN]
    C -->|Mock State| E[MISMATCH]
    C -->|Mock State| F[MERGE]
    C -->|Mock State| G[NOMINATION]

    E --> H((OpenAI / Codex API))
    H -->|Generates| I[Auto-Fix Plan & Joint Declaration]
    
    B --> J[Smart Dashboard]
    B --> K[Passbook Ledger]
    B --> L[Claims Tracker]
    B --> M[Grievance Engine]
\\\

## 💻 Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, Framer Motion (Animations)
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

## 🛠️ Local Development

1. Clone the repository:
   \\\ash
   git clone https://github.com/CodeWithRJ006/saral-pf.git
   \\\
2. Install dependencies:
   \\\ash
   npm install
   \\\
3. Run the development server:
   \\\ash
   npm run dev
   \\\
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License

This project is built as a proof-of-concept/hackathon submission. All rights reserved.
