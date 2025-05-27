**QuadFund — Decentralized Quadratic Grant Funding on Sui**

> Built for Sui Overflow 2025 | Track: Payments & Wallets

**QuadFund** is a gamified, transparent grant funding platform powered by **quadratic voting**. Built on the **Sui blockchain**, it empowers communities to fund high-impact projects through a fair and decentralized mechanism.

---

## **Table of Contents**

* [Overview](#overview)
* [Live Demo](#live-demo)
* [Key Features](#key-features)
* [Tech Stack](#tech-stack)
* [How It Works](#how-it-works)
* [Smart Contract Overview](#smart-contract-overview)
* [Installation & Local Setup](#installation--local-setup)
* [Future Roadmap](#future-roadmap)


---

## **Overview**

**QuadFund** enables:

* **Creators** to submit proposals with milestone-based funding goals.
* **Donors** to vote using \$SUI. The more you vote, the more it costs (Quadratic Logic).

This ensures that **popular support, not deep pockets, decides what gets funded.**

**Live Demo:**
https://quadfundsui.vercel.app/index

You can:

* Connect your Sui wallet (Suiet)
* Browse projects
* Vote using SUI (on-chain!)
* Submit your own grant proposal

---

## **Key Features:**

* **Quadratic Voting:** 1 vote = 1 SUI, 2 votes = 4 SUI, etc.
* **Milestone-Based Funding:** Funds released as creators hit goals.
* **Wallet Integration:** Using Suiet Kit + @mysten/sui.js
* **Gamified Mascot:** Coming soon — Mochi levels up with community support.

---



 **How It Works**

![Image](https://github.com/user-attachments/assets/ba8c2b33-54af-46b1-8c7b-599de604cda3)

> **Flow Summary**:
> → Creator submits proposal
> → Donors vote using SUI (quadratic logic)
> → Smart contract tracks funds using `get_raised()`
> → Funds are disbursed per milestone by admin/DAO

## **Tech Stack**

Frontend

* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Suiet Wallet Kit](https://kit.suiet.app/)
* [@mysten/sui.js](https://www.npmjs.com/package/@mysten/sui.js)

Backend / Smart Contracts

* [Move Language](https://move-language.github.io/)
* Sui Testnet
* Deployed contract: `0x<your_package_id>`

 **Smart Contract Overview**

**Module:** `quadfund_donation`

* `create_project(title, goal_amount, milestones)`
* `donate(project_id, Coin<SUI>)`
* `get_raised(project_id)`
* `get_donation_by(address, project_id)`

**Quadratic Voting Logic:**

```move
cost = votes^2 * base_sui;
```

**Deployed Package:**

> `0x6541c1313d3288c12ef0ac5e77a2a990f4ab7948cfe604fc5f3929f97c81c744`

---

## **Installation & Local Setup**

```bash
# 1. Clone repo
git clone https://github.com/your-repo/quadfund.git
cd quadfund

# 2. Install dependencies
npm install

# 3. Run locally
npm run dev
```

Make sure you have:

* Slush Wallet installed
* Connected to **Sui Testnet**

 **Future Roadmap**

* [ ] **Mochi NFT system** — Donor levels + project badges
* [ ] DAO-based project approval
* [ ] Multi-round voting & fund matching
* [ ] Sui Mainnet deployment

