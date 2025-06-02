import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@mysten/dapp-kit';

export default function Homepage() {
  const [view, setView] = useState('donor'); // 'donor' or 'creator'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const donorContent = {
    steps: [
      {
        title: 'Connect Your Wallet',
        description: 'Securely link your Sui wallet to join the QuadFund platform. This will give you access to explore projects, vote with impact, and track your funding progress transparently on-chain.',
        image: 'https://gist.githubusercontent.com/frosty2702/6ea99a718ca080edac425468de44e805/raw/1ee367204097c11090f3262c223bee2e9630a5fb/walletforsui.svg'
      },
      {
        title: 'Discover Projects and Vote Using SUI',
        description: 'Browse through a curated list of grant proposals from passionate builders.\nWe vote by spending SUI — and voting follows a quadratic rule:\n• 1 vote = 1 SUI\n• 2 votes = 4 SUI\n• 3 votes = 9 SUI, and so on\nThis ensures you vote for the project, the more it costs — showing deeper commitment without letting whales dominate.',
        image: 'https://gist.githubusercontent.com/frosty2702/4dca6a2fb09e3860f679521b84879ae9/raw/f9f8a79b0cd98e019e1ce2d4be367bac228600e3/discover-projects.svg'
      },
      {
        title: 'Funds Are Locked in Smart Contracts',
        description: 'When a project wins enough votes, the matching grant funds are securely locked in a smart contract. This ensures no upfront payouts and keeps your contribution safe until progress is made.',
        image: 'https://gist.githubusercontent.com/frosty2702/760d63f21bac0fd4ad0656f3806feae1/raw/e9bc11c2e1254508a07ea97e081c12cff3443966/unlock-funds.svg'
      },
      {
        title: 'Fund Release Tied to Milestones',
        description: "Teams must hit clearly defined milestones to unlock their funding step-by-step. You're not just donating — you're powering real innovation while ensuring creators stay accountable.",
        image: 'https://gist.githubusercontent.com/frosty2702/880ac08fe097ae6730c9dd9e8f061ee4/raw/d0f12aa04c1a3d46faa153e02ba5f9b7d0c7ec32/milestone.svg'
      }
    ]
  };

  const creatorContent = {
    steps: [
      {
        title: 'Connect Your Wallet',
        description: 'Securely link your Sui wallet to QuadFund and unlock the gateway to decentralized funding. Your wallet is your identity — it lets you submit proposals, receive funds, and manage everything directly on-chain, with full transparency and security.',
        image: 'https://gist.githubusercontent.com/frosty2702/6ea99a718ca080edac425468de44e805/raw/1ee367204097c11090f3262c223bee2e9630a5fb/walletforsui.svg'
      },
      {
        title: 'Submit Your Proposal with Milestones',
        description: "Craft a strong, inspiring grant proposal that shares your project's vision, impact, and goals.\nDefine clear milestones that show the community exactly how you'll build — no vague promises, because funding is tied to real progress, not empty promises.\nThe stronger your roadmap, the stronger your chances of winning community-driven quad votes.",
        image: 'https://gist.githubusercontent.com/frosty2702/2ccff3e77312d4949efcb79725b34861/raw/bfe902fa0ef15e9733f9056634ad6c003314ae1c/pitchproposal.svg'
      },
      {
        title: 'Earn Community Votes',
        description: "Once your proposal is live, rally the QuadFund community! Donors will use quadratic voting to support the projects they believe in.\nEvery extra vote costs them more SUI, so when you earn votes, you earn real, weighted trust — not just popularity points.\nWin the votes, and you secure your grant — but the journey doesn't stop there.",
        image: '/treasurechest.png'
      },
      {
        title: 'Complete Milestones and Unlock Funds',
        description: "Winning proposals have their funding locked in smart contracts, not instantly handed over.\nAs you achieve each milestone you promised, a portion of your grant funds are unlocked automatically.\nDeliver real progress, build community trust, and grow your project the right way — transparently, step-by-step, on-chain.",
        image: 'https://gist.githubusercontent.com/frosty2702/880ac08fe097ae6730c9dd9e8f061ee4/raw/d0f12aa04c1a3d46faa153e02ba5f9b7d0c7ec32/milestone.svg'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white font-jakarta">
      {/* Navigation */}
      <nav className="flex items-center px-4 sm:px-8 py-4 relative bg-[#F0992A]">
        <Link 
          href="/" 
          style={{ 
            fontFamily: '"Press Start 2P", cursive',
            color: 'white'
          }}
          className="text-xl sm:text-2xl font-bold w-1/4"
        >
          QuadFund
        </Link>
        
        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center justify-center gap-[75px] flex-1">
          <Link 
            href="/homepage" 
            className="text-white no-underline border-b-2 border-transparent hover:border-white pb-1 transition-colors font-jakarta"
          >
            Home
          </Link>
          <Link 
            href="/projectlist" 
            className="text-white no-underline border-b-2 border-transparent hover:border-white pb-1 transition-colors font-jakarta"
          >
            Projects
          </Link>
          <Link 
            href="/submissions" 
            className="text-white no-underline border-b-2 border-transparent hover:border-white pb-1 transition-colors font-jakarta"
          >
            Submissions
          </Link>
          <Link 
            href="/profile" 
            className="text-white no-underline border-b-2 border-transparent hover:border-white pb-1 transition-colors font-jakarta"
          >
            Profile
          </Link>
          <Link 
            href="/contact" 
            className="text-white no-underline border-b-2 border-transparent hover:border-white pb-1 transition-colors font-jakarta"
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
          className="md:hidden ml-auto flex items-center text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#F0992A] z-50 border-b shadow-lg md:hidden">
            <div className="flex flex-col p-4 space-y-4">
              <Link href="/homepage" className="text-white hover:text-white hover:border-b-2 hover:border-white pb-1 transition-all font-jakarta">Home</Link>
              <Link href="/projectlist" className="text-white hover:text-white hover:border-b-2 hover:border-white pb-1 transition-all font-jakarta">Projects</Link>
              <Link href="/submissions" className="text-white hover:text-white hover:border-b-2 hover:border-white pb-1 transition-all font-jakarta">Submissions</Link>
              <Link href="/profile" className="text-white hover:text-white hover:border-b-2 hover:border-white pb-1 transition-all font-jakarta">Profile</Link>
              <Link href="/contact" className="text-white hover:text-white hover:border-b-2 hover:border-white pb-1 transition-all font-jakarta">Contact</Link>
              <div className="pt-2">
                <ConnectButton />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-[#F0992A] py-8 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl w-full">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white">
              Fund the Future, One Vote at a Time.
            </h1>
            <p className="text-base sm:text-lg text-white">
              QuadFund is a decentralized grant platform built on Sui, designed to empower creators through fair community-driven funding. We put power in your hands: every vote helps to build ideas that matter.
            </p>
          </div>
          <div className="relative w-full md:w-96 h-48 sm:h-72">
            <Image
              src="/hero-illustration.png"
              alt="QuadFund Illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center text-black" style={{ fontFamily: '"Press Start 2P", cursive' }}>About QuadFund</h2>
        <p className="text-base sm:text-lg mb-8 sm:mb-12 text-black text-center font-jakarta">
          QuadFund is a decentralized grant platform built on the Sui blockchain, designed to empower creators through fair, community-driven funding. Built on Web3's values of transparency, openness, and innovation, QuadFund makes it easy for donors to fund bold ideas and for creators to bring them to life.
        </p>

        {/* How it Works Section */}
        <div className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-black" style={{ fontFamily: '"Press Start 2P", cursive' }}>How QuadFund Works</h2>
          
          {/* Toggle Buttons */}
          <div className="flex gap-2 sm:gap-4 mb-8 sm:mb-12 justify-center">
            <button
              onClick={() => setView('donor')}
              className={`px-4 sm:px-8 py-3 rounded-full text-base sm:text-lg font-medium transition-colors w-32 sm:w-40 ${
                view === 'donor'
                  ? 'bg-[#F0992A] text-white'
                  : 'bg-white border border-[#F0992A] text-[#F0992A]'
              }`}
              style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.75rem' }}
            >
              Donor
            </button>
            <button
              onClick={() => setView('creator')}
              className={`px-4 sm:px-8 py-3 rounded-full text-base sm:text-lg font-medium transition-colors w-32 sm:w-40 ${
                view === 'creator'
                  ? 'bg-[#F0992A] text-white'
                  : 'bg-white border border-[#F0992A] text-[#F0992A]'
              }`}
              style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.75rem' }}
            >
              Creator
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-8 sm:space-y-16">
            {(view === 'donor' ? donorContent.steps : creatorContent.steps).map((step, index) => (
              <div key={index} className="flex flex-col lg:flex-row lg:items-center gap-6 sm:gap-12">
                {/* For even indices (0, 2, etc.), show text first then image */}
                {index % 2 === 0 ? (
                  <>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-black">{step.title}</h3>
                      <p className="text-sm sm:text-lg whitespace-pre-line text-black font-jakarta">{step.description}</p>
                    </div>
                    <div className="relative w-full lg:w-80 h-48 sm:h-60 flex-shrink-0">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className={`object-contain ${step.title.includes('Wallet') ? 'scale-110' : ''}`}
                      />
                    </div>
                  </>
                ) : (
                  /* For odd indices (1, 3, etc.), show image first then text */
                  <>
                    <div className="relative w-full lg:w-80 h-48 sm:h-60 flex-shrink-0 order-2 lg:order-1">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className={`object-contain ${step.title.includes('Wallet') ? 'scale-110' : ''}`}
                      />
                    </div>
                    <div className="flex-1 order-1 lg:order-2">
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-black">{step.title}</h3>
                      <p className="text-sm sm:text-lg whitespace-pre-line text-black font-jakarta">{step.description}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Meet Mochi Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-16">
          <div className="bg-[#F0992A] p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white" style={{ fontFamily: '"Press Start 2P", cursive' }}>Meet Mochi</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row p-6 sm:p-12">
            <div className="flex-1">
              <p className="mb-4 sm:mb-6 text-black" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.875rem', lineHeight: '1.6' }}>
                Mochi is your personal 8-bit companion on QuadFund, growing with every donation you make.
              </p>
              
              <p className="mb-4 sm:mb-6 text-black" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.875rem', lineHeight: '1.6' }}>
                As you support more projects, your Mochi earns badges and levels up, showing off your impact in the community.
              </p>
              
              <p className="mb-4 sm:mb-6 text-black" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.875rem', lineHeight: '1.6' }}>
                For now, Mochi evolves through a set of fixed avatar stages, but as QuadFund grows, we plan to introduce a wide range of accessories, badges, and customizations.
              </p>
              
              <p className="text-black" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.875rem', lineHeight: '1.6' }}>
                Our long-term vision is to turn Mochi into a dynamic NFT, giving you a living, collectible proof of your contribution to decentralized innovation. Every vote not only funds creators - it shapes your own Mochi legacy.
              </p>
            </div>
            
            <div className="relative w-full lg:w-80 h-64 sm:h-80 flex-shrink-0 mt-6 lg:mt-0">
              <Image
                src="https://gist.githubusercontent.com/frosty2702/f295699377ec1adc837590972d1c3700/raw/c63ae1786a325eb5d0198444064350c57c841293/mochievol.svg"
                alt="Mochi"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* BTS Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-black" style={{ fontFamily: '"Press Start 2P", cursive' }}>BTS of QuadFund</h2>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-lg text-black text-center font-jakarta">
              QuadFund was built by a group of college students and close friends who simply love building things that matter.
            </p>
            <p className="text-sm sm:text-lg text-black text-center font-jakarta">
              We're not Web3 experts or seasoned professionals — just a small crew passionate about democratizing creativity, heart, and code.
            </p>
            <p className="text-sm sm:text-lg text-black text-center font-jakarta">
              What brought us together wasn't a deep dive into blockchain, but a shared frustration: why is funding for great ideas often locked behind closed doors?
            </p>
            <p className="text-sm sm:text-lg text-black text-center font-jakarta">
              We wanted to create something open, fair, and community-driven — where builders are valued for their ideas, not their connections.
            </p>
            <p className="text-sm sm:text-lg text-black text-center font-jakarta">
              QuadFund blends our love for pixel art creativity, our drive to make an impact, and a simple belief:
            </p>
            <p className="text-sm sm:text-lg text-black text-center font-jakarta">
              The future should be built by anyone with vision, not just those with access.
            </p>
            <p className="text-sm sm:text-lg text-black text-center font-jakarta">
              We're learning, still figuring things out — but we're building QuadFund the way we think everything should be built:
            </p>
            <p className="text-sm sm:text-lg text-black text-center font-jakarta">
              with friends, with purpose, and with the people in mind.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#F0992A] py-4 text-center mt-0">
        <p className="font-pixel text-xs sm:text-sm text-black">Built for Sui Overflow 2025</p>
        <p className="font-pixel text-xs sm:text-sm text-black">@QuadFund</p>
      </footer>
    </div>
  );
}
