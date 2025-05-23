import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import VoteButton from '../components/VoteButton';
import TestTxButton from '../components/TestTxButton';
import SimpleVoteButton from '../components/SimpleVoteButton';
import DirectVoteButton from '../components/DirectVoteButton';
import { useState } from 'react';

export default function ProjectsPage() {
  const account = useCurrentAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [raisedAmount, setRaisedAmount] = useState(94); // Starting amount in SUI
  const [totalAmount] = useState(320); // Total goal in SUI
  
  // Update the raised amount when a vote is successful
  const handleSuccessfulVote = (voteAmount, updatedTotalFromContract) => {
    // If we got an updated total from contract, use that
    if (updatedTotalFromContract) {
      setRaisedAmount(updatedTotalFromContract);
    } else {
      // Otherwise just add the vote amount
      setRaisedAmount(prevAmount => prevAmount + voteAmount);
    }
  };

  // Calculate progress percentage for the progress bar
  const progressPercentage = Math.min(100, Math.round((raisedAmount / totalAmount) * 100));

  // Dynamic project data based on current state
  const projectData = {
    title: 'SuiLens',
    description: 'SuiLens is a live DeFi analytics dashboard designed to help users track protocol health, wallet behavior, TVL, and whale movements on Sui blockchain. It provides real-time charts, wallet profiles, and custom alerts, turning raw blockchain data into actionable insights for DeFi users, investors, and builders. With the explosive growth of Sui, SuiLens brings clarity, transparency, and better decision-making to everyone in the ecosystem.',
    requestedGrant: `${totalAmount} SUI`,
    raisedAmount: `${raisedAmount}/${totalAmount} SUI Raised`,
    githubRepo: 'https://github.com/suilabs/suilens',
    milestones: [
      {
        text: 'Set up basic data feed from Sui and display TVL + wallet balances.',
        status: 'completed',
        amount: '80 SUI Unlocked'
      },
      {
        text: 'Build live dashboard interface with charts and real-time updates.',
        status: 'pending',
        amount: '80 SUI Locked'
      },
      {
        text: 'Add alert feed and basic wallet analytics page.',
        status: 'pending',
        amount: '60 SUI Locked'
      },
      {
        text: 'Display demo chart or alert snippet on QuadFund project page.',
        status: 'pending',
        amount: '100 SUI Locked'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white font-jakarta">
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
            className="text-black no-underline border-b-2 border-transparent hover:border-[#F0992A] pb-1 transition-colors font-jakarta"
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
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-6 sm:mb-8 border-b border-black pb-4 text-black">{projectData.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column */}
          <div>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 font-jakarta font-normal text-black">{projectData.description}</p>

            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">
                Requested Grant Amount (in SUI): {projectData.requestedGrant}
              </h2>
              
              {/* Progress Bar */}
              <div className="relative h-6 sm:h-8 bg-gray-200 rounded-md mb-2 overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-[#F0992A]"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="h-full w-full bg-[url('/progress-pattern.svg')] bg-repeat-x"></div>
                </div>
              </div>
              <p className="text-base sm:text-lg font-medium text-black">{projectData.raisedAmount}</p>
            </div>

            {/* Milestones */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between">
                <h3 className="text-lg sm:text-xl text-[#F0992A] font-semibold">Milestone</h3>
                <h3 className="text-lg sm:text-xl text-[#F0992A] font-semibold">Amount Unlocked</h3>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {projectData.milestones.map((milestone, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1">
                      <div className={`min-w-4 h-4 rounded-full ${
                        milestone.status === 'completed' 
                          ? 'bg-[#F0992A]' 
                          : 'border-2 border-gray-300'
                      }`}></div>
                      <p className="text-xs sm:text-sm flex-1 font-normal text-black">{milestone.text}</p>
                    </div>
                    <p className={`text-xs sm:text-sm whitespace-nowrap ${
                      milestone.status === 'completed' 
                        ? 'font-bold text-black' 
                        : 'font-normal text-black'
                    }`}>
                      {milestone.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="mt-6 sm:mt-8">
              <p className="mb-2 text-sm sm:text-base break-words text-black font-normal">
                Github repo: {' '}
                <a 
                  href={projectData.githubRepo} 
                  className="text-blue-500 underline hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {projectData.githubRepo}
                </a>
              </p>
              <p className="text-sm sm:text-base text-black font-normal">Socials:</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-center mt-8 lg:mt-0">
            <div className="mb-6 sm:mb-8 relative w-full aspect-[4/3] max-w-md">
              <Image
                src="/suilens.png" 
                alt="Analytics Dashboard"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Vote Buttons - With working quadratic voting */}
            {account ? (
              <div className="flex flex-col items-center gap-4">
                <VoteButton onSuccessfulVote={handleSuccessfulVote} />
                <p className="text-xs text-black mt-1 font-normal">
                  Vote with quadratic cost: 1 vote = 1 SUI, 2 votes = 4 SUI, etc.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <ConnectButton />
                <p className="mt-2 text-xs sm:text-sm text-black font-normal">Connect wallet to vote</p>
              </div>
            )}
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