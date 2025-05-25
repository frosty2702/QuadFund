import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';
import Navigation from '../components/Navigation';

export default function ProjectListPage() {
  const account = useCurrentAccount();
  
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

  return (
    <div className="min-h-screen bg-white font-jakarta flex flex-col">
      <Navigation activePage="projects" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 md:py-16 flex-grow w-full">
        {/* Info Section - Similar to the image */}
        <div className="bg-[#F0992A] rounded-xl mb-8 sm:mb-12 p-5 sm:p-8 md:p-10 border border-black">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-black font-jakarta">
            How QuadFund Rounds Work?
          </h2>
          
          <p className="mb-4 text-sm sm:text-base text-black font-jakarta">
            QuadFund operates in funding rounds where creators submit new grant proposals.
            During each round, donors cast quadratic votes to support the projects they believe in.
            At the end of the round, funds are distributed automatically based on the total community votes, fully transparently on-chain.
          </p>
          
          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 mt-4 sm:mt-6 text-black font-jakarta">
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

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 border-b pb-2 text-black font-jakarta">
          April-May
        </h2>
        
        {/* Project Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project) => (
            <Link 
              href={project.id === "suilens" ? "/projects" : "#"} 
              key={project.id}
              className="border border-black rounded-lg p-4 sm:p-6 flex flex-col items-center hover:shadow-md transition-shadow"
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-3 sm:mb-4">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-contain"
                />
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-black">{project.name}</h3>
              <p className="text-xs sm:text-sm text-black">
                Requesting <span className="font-bold">{project.requestedAmount}</span>
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