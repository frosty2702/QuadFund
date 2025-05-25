import Link from 'next/link';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProfilePage() {
  const account = useCurrentAccount();
  const [donationCount, setDonationCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // This simulates listening for new donations
  // In a real app, this would be replaced with blockchain event listeners
  useEffect(() => {
    // Check local storage for stored donation count
    const storedCount = localStorage.getItem('donationCount');
    if (storedCount) {
      setDonationCount(parseInt(storedCount, 10));
    }

    // Listen for custom event that would be triggered when a user votes
    const handleVote = (e) => {
      const newCount = donationCount + 1;
      setDonationCount(newCount);
      localStorage.setItem('donationCount', newCount.toString());
    };

    window.addEventListener('quadfund:vote', handleVote);

    // For demo purposes, you can dispatch this event from the browser console:
    // window.dispatchEvent(new Event('quadfund:vote'))

    return () => {
      window.removeEventListener('quadfund:vote', handleVote);
    };
  }, [donationCount]);

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
            className="text-black no-underline border-b-2 border-[#F0992A] pb-1 transition-colors font-jakarta"
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

      {/* Profile Info */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-16 flex-grow w-full">
        <div className="bg-[#F0992A] rounded-xl sm:rounded-3xl p-6 sm:p-12 shadow-lg space-y-6 sm:space-y-8 md:w-4/5 mx-auto">
          <div>
            <p className="text-lg sm:text-xl mb-2 font-bold text-white">Wallet Address:</p>
            <p className="bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg break-all border border-black text-black font-medium text-sm sm:text-base">
              {account ? account.address : 'Please connect your wallet'}
            </p>
          </div>

          <div>
            <p className="text-lg sm:text-xl mb-2 font-bold text-white">Number of Donations:</p>
            <p className="bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-black text-black font-medium text-xl">
              {donationCount}
            </p>
            <p className="text-xs text-white mt-1 italic">
              (When you vote on projects, this counter will automatically update)
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
            <div className="md:w-1/2">
              <p className="text-lg sm:text-xl mb-2 font-bold text-white">Mochi level:</p>
              <p className="text-base sm:text-lg text-white font-medium">Level 1 - Beginner</p>
            </div>
            <div className="relative w-48 h-48 mt-4 md:mt-0 mx-auto md:mx-0">
              <Image
                src="https://gist.githubusercontent.com/frosty2702/462a55d41350dfc721ad29e70f04ddf5/raw/32a0a10536f947686fee1d54992b1d7275e135f0/babymochi.svg"
                alt="Baby Mochi"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#F0992A] py-4 text-center w-full">
        <p className="font-pixel text-xs sm:text-sm text-black">Built for Sui Overflow 2025</p>
        <p className="font-pixel text-xs sm:text-sm text-black">@QuadFund</p>
      </footer>
    </div>
  );
} 