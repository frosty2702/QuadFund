// Default projects data that doesn't rely on Supabase
const defaultProjects = [
  {
    id: "suilens",
    title: "SuiLens",
    description: "SuiLens is a powerful analytics tool that provides insights into the Sui blockchain ecosystem.",
    image: "/projects/suilens.jpg",
    grantAmount: "50000",
    status: "Approved",
    walletAddress: "0x1234567890abcdef",
    submittedDate: "2023-05-01"
  },
  {
    id: "pixelmint",
    title: "PixelMint",
    description: "A unique NFT creation platform that allows users to create, mint, and trade pixel art NFTs on Sui.",
    image: "/projects/pixelmint.jpg",
    grantAmount: "35000",
    status: "Approved",
    walletAddress: "0x1234567890abcdef",
    submittedDate: "2023-05-15"
  },
  {
    id: "questloop",
    title: "QuestLoop",
    description: "Gamified learning platform for blockchain education with interactive quests and rewards.",
    image: "/projects/questloop.jpg",
    grantAmount: "42000",
    status: "Approved",
    walletAddress: "0x1234567890abcdef",
    submittedDate: "2023-06-01"
  }
];

export default function handler(req, res) {
  res.status(200).json({ projects: defaultProjects });
}
