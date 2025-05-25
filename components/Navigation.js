import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@mysten/dapp-kit';

export default function Navigation({ activePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 relative bg-[#F0992A] z-10">
        <Link 
          href="/" 
          style={{ 
            fontFamily: '"Press Start 2P", cursive',
            color: 'white'
          }}
          className="text-lg sm:text-xl md:text-2xl font-bold mr-2 min-w-fit"
        >
          QuadFund
        </Link>
        
        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-12 flex-1">
          <Link 
            href="/homepage" 
            className={`text-white no-underline border-b-2 ${activePage === 'home' ? 'border-white' : 'border-transparent'} hover:border-white pb-1 transition-colors font-jakarta text-sm lg:text-base`}
          >
            Home
          </Link>
          <Link 
            href="/projectlist" 
            className={`text-white no-underline border-b-2 ${activePage === 'projects' ? 'border-white' : 'border-transparent'} hover:border-white pb-1 transition-colors font-jakarta text-sm lg:text-base`}
          >
            Projects
          </Link>
          <Link 
            href="/submissions" 
            className={`text-white no-underline border-b-2 ${activePage === 'submissions' ? 'border-white' : 'border-transparent'} hover:border-white pb-1 transition-colors font-jakarta text-sm lg:text-base`}
          >
            Submissions
          </Link>
          <Link 
            href="/profile" 
            className={`text-white no-underline border-b-2 ${activePage === 'profile' ? 'border-white' : 'border-transparent'} hover:border-white pb-1 transition-colors font-jakarta text-sm lg:text-base`}
          >
            Profile
          </Link>
          <Link 
            href="/contact" 
            className={`text-white no-underline border-b-2 ${activePage === 'contact' ? 'border-white' : 'border-transparent'} hover:border-white pb-1 transition-colors font-jakarta text-sm lg:text-base`}
          >
            Contact
          </Link>
        </div>
        
        {/* Wallet Connect - Right aligned */}
        <div className="hidden md:block ml-auto">
          <ConnectButton />
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden ml-auto flex items-center text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>
      
      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-[3.5rem] left-0 right-0 bg-[#F0992A] z-50 border-b shadow-lg md:hidden" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                href="/homepage" 
                className={`text-white hover:text-white hover:border-b-2 hover:border-white pb-1 transition-all font-jakarta ${activePage === 'home' ? 'border-b-2 border-white' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/projectlist" 
                className={`text-white hover:text-white hover:border-b-2 hover:border-white pb-1 transition-all font-jakarta ${activePage === 'projects' ? 'border-b-2 border-white' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <Link 
                href="/submissions" 
                className={`text-white hover:text-white hover:border-b-2 hover:border-white pb-1 transition-all font-jakarta ${activePage === 'submissions' ? 'border-b-2 border-white' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Submissions
              </Link>
              <Link 
                href="/profile" 
                className={`text-white hover:text-white hover:border-b-2 hover:border-white pb-1 transition-all font-jakarta ${activePage === 'profile' ? 'border-b-2 border-white' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link 
                href="/contact" 
                className={`text-white hover:text-white hover:border-b-2 hover:border-white pb-1 transition-all font-jakarta ${activePage === 'contact' ? 'border-b-2 border-white' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-2">
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 