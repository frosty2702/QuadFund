import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import Image from 'next/image';

export default function SubmissionsPage() {
  const account = useCurrentAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectTitle: '',
    description: '',
    grantAmount: '',
    githubRepo: '',
    milestones: [
      { text: '', unlockAmount: '' }
    ]
  });

  // Additional CSS styles for inputs to ensure text is black
  const inputStyle = {
    color: 'black',
    fontWeight: '500'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      milestones: updatedMilestones
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { text: '', unlockAmount: '' }]
    }));
  };

  const removeMilestone = (index) => {
    if (formData.milestones.length <= 1) return;
    const updatedMilestones = formData.milestones.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      milestones: updatedMilestones
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the submission
    console.log(formData);
    // In a real app, you'd send this to your backend or smart contract
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
            className="text-black no-underline border-b-2 border-[#F0992A] pb-1 transition-colors font-jakarta"
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-black" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          Submit Your Project
        </h1>
        
        <p className="text-base sm:text-lg mb-8 text-center text-black">
          Ready to bring your idea to life? Fill out the form below to submit your project for community funding.
        </p>

        <div className="bg-[#F0992A] rounded-xl sm:rounded-3xl p-6 sm:p-12 shadow-lg md:w-4/5 mx-auto">
          {!account ? (
            <div className="text-center py-8">
              <p className="text-xl mb-4">Please connect your wallet to submit a project</p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div>
                <label htmlFor="projectTitle" className="block text-lg sm:text-xl mb-2 font-bold text-black">
                  Project Title:
                </label>
                <input
                  type="text"
                  id="projectTitle"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  style={inputStyle}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border border-black focus:ring-2 focus:ring-[#276CBE] text-black font-medium"
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-lg sm:text-xl mb-2 font-bold text-black">
                  Project Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  style={inputStyle}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border border-black focus:ring-2 focus:ring-[#276CBE] text-black font-medium"
                  placeholder="Describe your project in detail"
                  required
                />
              </div>

              <div>
                <label htmlFor="grantAmount" className="block text-lg sm:text-xl mb-2 font-bold text-black">
                  Requested Grant Amount (in SUI):
                </label>
                <input
                  type="number"
                  id="grantAmount"
                  name="grantAmount"
                  value={formData.grantAmount}
                  onChange={handleInputChange}
                  min="1"
                  style={inputStyle}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border border-black focus:ring-2 focus:ring-[#276CBE] text-black font-medium"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label htmlFor="githubRepo" className="block text-lg sm:text-xl mb-2 font-bold text-black">
                  GitHub Repository URL (optional):
                </label>
                <input
                  type="url"
                  id="githubRepo"
                  name="githubRepo"
                  value={formData.githubRepo}
                  onChange={handleInputChange}
                  style={inputStyle}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border border-black focus:ring-2 focus:ring-[#276CBE] text-black font-medium"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-lg sm:text-xl">Milestones:</label>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="bg-white text-black py-1 px-3 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors border border-black"
                  >
                    + Add Milestone
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg">
                      <div className="flex-grow">
                        <label htmlFor={`milestone-${index}`} className="block text-sm mb-1 font-bold text-black">
                          Milestone Description:
                        </label>
                        <textarea
                          id={`milestone-${index}`}
                          value={milestone.text}
                          onChange={(e) => handleMilestoneChange(index, 'text', e.target.value)}
                          rows={2}
                          style={inputStyle}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-black focus:ring-2 focus:ring-[#276CBE] text-black font-medium"
                          placeholder="Describe this milestone"
                          required
                        />
                      </div>
                      <div className="sm:w-1/4">
                        <label htmlFor={`unlockAmount-${index}`} className="block text-sm mb-1 font-bold text-black">
                          Unlock Amount:
                        </label>
                        <div className="flex">
                          <input
                            type="number"
                            id={`unlockAmount-${index}`}
                            value={milestone.unlockAmount}
                            onChange={(e) => handleMilestoneChange(index, 'unlockAmount', e.target.value)}
                            min="1"
                            style={inputStyle}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-black focus:ring-2 focus:ring-[#276CBE] text-black font-medium"
                            placeholder="Amount"
                            required
                          />
                          {formData.milestones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMilestone(index)}
                              className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors border border-black font-bold"
              >
                Submit Project
              </button>
            </form>
          )}
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