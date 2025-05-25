import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';

export default function ProjectListPage() {
  const account = useCurrentAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
<<<<<<< Updated upstream
  // Project data for the cards
  const projects = [
    {
      id: "suilens",
      name: "SuiLens",
      image: "/suilens.png",
      requestedAmount: "320 SUI"
    },
    {
      id: "pixelmint",
      name: "PixelMint",
      image: "/pixelmint.png",
      requestedAmount: "140 SUI"
    },
    {
      id: "questloop",
      name: "QuestLoop",
      image: "/questloop.png",
      requestedAmount: "175 SUI"
    }
  ];
=======
  // Fetch projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsQuery = query(
          collection(db, "projects"), 
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(projectsQuery);
        const projectsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Format the createdAt timestamp
          createdAt: doc.data().createdAt ? new Date(doc.data().createdAt.toDate()).toLocaleDateString() : 'N/A'
        }));
        
        setProjects(projectsList);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  // Default project images if none are provided
  const defaultImages = {
    "SuiLens": "/treasurechest.png",
    "PixelMint": "/pixelmint.png",
    "QuestLoop": "/questloop.png",
    "default": "/treasurechest.png"
  };
>>>>>>> Stashed changes

  return (
    <div className="min-h-screen bg-white font-jakarta flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center px-4 sm:px-8 py-4 border-b border-black relative">
        <Link 
          href="/" 
          style={{ 
            fontFamily: '"Press Start 2P", cursive',
            color: 'black'
          }}
          className="text-xl sm:text-2xl font-bold w-1/4"
        >
          QuadFund
        </Link>
        
        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center justify-center gap-[75px] flex-1">
          <Link 
            href="/homepage" 
            className="text-black no-underline border-b-2 border-transparent hover:border-[#F0992A] pb-1 transition-colors font-jakarta"
          >
            Home
          </Link>
          <Link 
            href="/projectlist" 
            className="text-black no-underline border-b-2 border-[#F0992A] pb-1 transition-colors font-jakarta"
          >
            Projects
          </Link>
          <Link 
            href="/submissions" 
            className="text-black no-underline border-b-2 border-transparent hover:border-[#F0992A] pb-1 transition-colors font-jakarta"
          >
            Submissions
          </Link>
          <Link 
            href="/profile" 
            className="text-black no-underline border-b-2 border-transparent hover:border-[#F0992A] pb-1 transition-colors font-jakarta"
          >
            Profile
          </Link>
          <Link 
            href="/contact" 
            className="text-black no-underline border-b-2 border-transparent hover:border-[#F0992A] pb-1 transition-colors font-jakarta"
          >
            Contact
          </Link>
        </div>
        
        {/* Wallet Connect - Right aligned */}
        <div className="hidden md:block w-1/4 text-right">
          <ConnectButton />
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden ml-auto flex items-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white z-50 border-b shadow-lg md:hidden">
            <div className="flex flex-col p-4 space-y-4">
              <Link href="/homepage" className="text-black hover:text-black hover:border-b-2 hover:border-[#F0992A] pb-1 transition-all font-jakarta">Home</Link>
              <Link href="/projectlist" className="text-black hover:text-black hover:border-b-2 hover:border-[#F0992A] pb-1 transition-all font-jakarta">Projects</Link>
              <Link href="/submissions" className="text-black hover:text-black hover:border-b-2 hover:border-[#F0992A] pb-1 transition-all font-jakarta">Submissions</Link>
              <Link href="/profile" className="text-black hover:text-black hover:border-b-2 hover:border-[#F0992A] pb-1 transition-all font-jakarta">Profile</Link>
              <Link href="/contact" className="text-black hover:text-black hover:border-b-2 hover:border-[#F0992A] pb-1 transition-all font-jakarta">Contact</Link>
              <div className="pt-2">
                <ConnectButton />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16 flex-grow w-full">
        {/* Info Section - Similar to the image */}
        <div className="bg-[#F0992A] rounded-xl mb-8 sm:mb-12 p-6 sm:p-10 border border-black">
          <h2 className="text-xl sm:text-2xl font-medium mb-4 text-black font-jakarta">
            How QuadFund Rounds Work?
          </h2>
          
          <p className="mb-4 text-sm sm:text-base text-black font-jakarta">
            QuadFund operates in funding rounds where creators submit new grant proposals.
            During each round, donors cast quadratic votes to support the projects they believe in.
            At the end of the round, funds are distributed automatically based on the total community votes, fully transparently on-chain.
          </p>
          
          <h3 className="text-lg sm:text-xl font-medium mb-3 mt-6 text-black font-jakarta">
            What is a Round?
          </h3>
          
          <p className="text-sm sm:text-base text-black font-jakarta">
            A Round is a limited-time funding window (Approx. - 2 months) where new projects apply and donors vote.
            Creators must submit their proposals before a round closes to be eligible for funding.
            During the round, donors explore projects, cast votes, and boost the ones they believe in using quadratic voting.
            Once the round ends, votes are tallied and funds are fairly distributed to top projects — no middlemen, no delays.
            Rounds keep the energy fresh, competitive, and community-driven at every stage.
          </p>
        </div>

        <h2 className="text-xl sm:text-2xl font-medium mb-6 border-b pb-2 text-black font-jakarta">
          April-May
        </h2>
        
        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => (
            <Link 
              href={project.id === "suilens" ? "/projects" : "#"} 
              key={project.id}
              className="border border-black rounded-lg p-6 flex flex-col items-center hover:shadow-md transition-shadow"
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-contain"
                />
              </div>
              
              <h3 className="text-lg sm:text-xl font-medium mb-2 text-black">{project.name}</h3>
              <p className="text-sm text-black">
                Requesting <span className="font-medium">{project.requestedAmount}</span>
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#F0992A] py-4 text-center w-full mt-auto">
        <p className="font-pixel text-xs sm:text-sm text-black">Built for Sui Overflow 2025</p>
        <p className="font-pixel text-xs sm:text-sm text-black">@QuadFund</p>
      </footer>
    </div>
  );
} 