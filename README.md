Here’s your **perfect, professional, and hackathon-ready `README.md`** for the QuadFund GitHub repo — optimized for judges, future contributors, and showcasing the on-chain flow diagram you just made:

---

````markdown
# 🟡 QuadFund – Community-Powered Grants on Sui

**"With great power… comes community funding."**

QuadFund is a decentralized quadratic funding platform built on the Sui blockchain, designed to empower builders and align donor incentives through transparent, milestone-based grant distribution.

![QuadFund Banner](public/banner.png) <!-- Optional: Add a pixel-art banner or mascot here -->

---

## 🚀 Overview

QuadFund enables users to submit grant proposals with milestone breakdowns and lets the community vote using **quadratic voting logic** — ensuring fairness and minimizing whale dominance. All donations are locked in a **Move smart contract**, and funds are released gradually as milestones are achieved.

---

## 💡 Core Features

- 🧠 **Milestone-Based Grants** – Funds unlock round-by-round based on creator progress.
- 🗳 **Quadratic Voting** – 1 vote = 1 SUI, 2 votes = 4 SUI, promoting fairer contribution.
- 🔐 **On-Chain Transparency** – All votes and funds are stored and tracked on Sui Testnet.
- 🧩 **Modular Smart Contracts** – Move-based logic with extensibility in mind.
- 💻 **Live Wallet + UI Integration** – Built using Suiet Wallet Kit + @mysten/sui.js.
- 🐵 **Gamified UX with Mochi** – A pixel mascot that levels up with impact.

---

 🧭 User Flow:
![image](https://github.com/user-attachments/assets/0953be34-2133-4120-bcf6-c6bb9e5bb85b)



> 📌 See the full flow in our **[On-Chain Architecture Diagram →](./docs/quadfund_flow_map.png)**

---

## ⚙️ Tech Stack

* **Frontend**: Next.js + Tailwind + Suiet Wallet Kit
* **Blockchain**: Move (Sui Testnet)
* **Smart Contract Tools**: Sui CLI, Sui.js SDK
* **Design**: Figma + Excalidraw (for flow maps + pixel elements)
* **Hosting**: Vercel
* **Repo**: [github.com/frosty2702/QuadFund](https://github.com/frosty2702/QuadFund)
* **Website**: https://quadfundsui.vercel.app/

---

📦 Smart Contract Details

* **Module Name**: `quadfund_donation`
* **Package ID**: `0x6541c1313d3288c12ef0ac5e77a2a990f4ab7948cfe604fc5f3929f97c81c744`
* **Functions**:

  * `create_project()`: Adds a new project
  * `donate()`: Sends SUI with quadratic logic
  * `get_raised()`: Returns total SUI raised
  * `get_donation_by()`: Tracks donor contribution

---

 📋 How to Run Locally

1. Clone the repo

   ```bash
   git clone https://github.com/frosty2702/QuadFund.git
   cd QuadFund
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the dev server

   ```bash
   npm run dev
   ```

4. Connect your Slush Wallet (or compatible Sui wallet)

🌱 Future Roadmap

* ✅ Project storage & filtering
* 🔐 DAO-based milestone approvals
* 🧠 AI-powered grant matching
* 🧾 Donor certificates + leaderboards
* 🧩 NFT-based badge system for milestones
* 🌐 Multi-chain support (via Wormhole)

