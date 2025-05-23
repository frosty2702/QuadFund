import { useState, useRef } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@mysten/dapp-kit';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // For demo purposes, simulate successful submission
    // since EmailJS isn't fully set up yet
    setTimeout(() => {
      console.log('Form submitted:', { email, description });
      toast.success('Message sent successfully!');
      // Clear form
      setEmail('');
      setDescription('');
      setIsSubmitting(false);
    }, 1500);
    
    // When EmailJS is set up, uncomment this code:
    /*
    // EmailJS service configuration
    const serviceId = 'service_quadfund'; 
    const templateId = 'template_contact_form';
    const publicKey = 'your_public_key'; 
    
    const templateParams = {
      from_email: email,
      to_email: 'quadfund0@gmail.com',
      message: description,
    };
    
    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent successfully:', response);
        toast.success('Message sent successfully!');
        // Clear form
        setEmail('');
        setDescription('');
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
        toast.error('Failed to send message. Please try again.');
        setIsSubmitting(false);
      });
    */
  };

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
            className="text-black no-underline border-b-2 border-transparent hover:border-[#F0992A] pb-1 transition-colors font-jakarta"
          >
            Profile
          </Link>
          <Link 
            href="/contact" 
            className="text-black no-underline border-b-2 border-[#F0992A] pb-1 transition-colors font-jakarta"
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

      {/* Contact Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16 flex-grow w-full">
        <div className="bg-[#F0992A] rounded-xl sm:rounded-3xl p-6 sm:p-12 shadow-lg w-full md:w-4/5 mx-auto">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 w-full">
            <div className="w-full">
              <label htmlFor="email" className="block text-lg sm:text-xl mb-2">
                Enter Email :
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border border-black focus:ring-2 focus:ring-[#276CBE] text-black font-light"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="description" className="block text-lg sm:text-xl mb-2">
                Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border border-black focus:ring-2 focus:ring-[#276CBE] text-black font-light"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black py-2 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-gray-50 transition-colors border border-black disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
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