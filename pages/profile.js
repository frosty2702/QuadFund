import Link from 'next/link';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navigation from '../components/Navigation';

export default function ProfilePage() {
  const account = useCurrentAccount();
  const [donationCount, setDonationCount] = useState(0);

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
      <Navigation activePage="profile" />

      {/* Profile Info */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10 md:py-16 flex-grow w-full">
        <div className="bg-[#F0992A] rounded-xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-lg space-y-5 sm:space-y-8 md:w-4/5 mx-auto">
          <div>
            <p className="text-base sm:text-lg md:text-xl mb-2 font-bold text-white">Wallet Address:</p>
            <p className="bg-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg break-all border border-black text-black font-medium text-xs sm:text-sm overflow-auto">
              {account ? account.address : 'Please connect your wallet'}
            </p>
          </div>

          <div>
            <p className="text-base sm:text-lg md:text-xl mb-2 font-bold text-white">Number of Donations:</p>
            <p className="bg-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-black text-black font-bold text-lg sm:text-xl">
              {donationCount}
            </p>
            <p className="text-xs text-white mt-1 italic">
              (When you vote on projects, this counter will automatically update)
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
            <div className="md:w-1/2">
              <p className="text-base sm:text-lg md:text-xl mb-2 font-bold text-white">Mochi level:</p>
              <p className="text-sm sm:text-base md:text-lg text-white font-semibold">Level 1 - Beginner</p>
            </div>
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mt-4 md:mt-0 mx-auto md:mx-0">
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