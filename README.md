# ShadowStrike-AI-SOC

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)  
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blueviolet)](https://www.typescriptlang.org/)  

**Next-generation AI-powered Security Operations Center (SOC) platform** that analyzes raw security logs, maps attacker behavior to the MITRE ATT&CK framework, extracts IOCs, profiles threat actors, and generates actionable incident response intelligence—all in seconds.  

---

## Table of Contents
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Installation](#installation)  
- [Usage](#usage)    
- [License](#license)  

---

## Features
- **AI Log Analysis** — Upload or paste dummy logs to get instant threat insights.  
- **MITRE ATT&CK Mapping** — Detect attacker behavior and map to MITRE tactics & techniques.  
- **IOC Extraction** — Extract sample IPs, domains, file hashes, CVEs, URLs, and emails.  
- **Threat Actor Profiling** — Attribute attacks to known groups in demo mode.  
- **Incident Response Playbook** — Auto-generates a 7-phase IR plan template.  
- **Risk Scoring** — 0–100 composite risk score with confidence-based prioritization.  
- **Saved Reports** — Save, list, and revisit past analyses safely.  
- **Analytics Dashboard** — Interactive visual charts showing threat distributions.  
- **JWT Authentication & Admin Panel** — Secure login/register using placeholder credentials.  

---

## Tech Stack

| Layer         | Technology                                                                 |
|---------------|---------------------------------------------------------------------------|
| Frontend      | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui                       |
| Animations    | Framer Motion                                                              |
| Charts        | Recharts                                                                   |
| Backend       | Node.js, Express, TypeScript                                               |
| Database      | PostgreSQL (Drizzle ORM)                                                   |
| Auth          | JWT (jsonwebtoken + bcryptjs)                                              |
| API Spec      | OpenAPI 3.0 (Orval code generation)                                        |
| Package Mgmt  | pnpm (monorepo workspace)                                                  |

---

## Project Structure
```

Shadow-Strike/
│
├── artifacts/
│   ├── api-server/          # Express backend
│   └── shadow-strike/       # React frontend
├── lib/                     # Shared libraries & DB schema
├── scripts/                 # Post-merge scripts
├── .env.example             # Environment variable template (no real secrets)
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json

````

---

## Installation

**Prerequisites:**  
- Node.js 18+  
- pnpm (`npm install -g pnpm`)  
- PostgreSQL database (local or managed, use dummy credentials in dev)  

**Steps:**
```bash
# 1. Clone the repository
git clone https://github.com/Jarrar-Hassan/Shadow-Strike.git
cd Shadow-Strike

# 2. Install dependencies
pnpm install

# 3. Configure environment variables safely
cp .env.example .env
# Fill in safe placeholder values, DO NOT use real secrets

# 4. Run database migrations (local/dev)
pnpm --filter @workspace/db run migrate

# 5. Start development servers
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/shadow-strike run dev
````

---

## Usage

1. Open frontend on `localhost:5173`.
2. Register or login using **placeholder credentials**.
3. Paste or upload **sample logs** only.
4. View MITRE mapping, IOC extraction, threat actor profiling, risk scoring, and IR playbook templates.
5. Save reports for testing/demo purposes only.

---

## License

MIT © [Jarrar Hassan](https://github.com/Jarrar-Hassan)

