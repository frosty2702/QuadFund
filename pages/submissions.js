import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import Image from 'next/image';
import { toast } from 'react-hot-toast'; // Import toast for notifications

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
  const [projectImage, setProjectImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isResetingForm, setIsResetingForm] = useState(false);
  
  // Add state for user submissions
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(null);
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'mySubmissions'
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(null);

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

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      
      console.log("Selected image:", {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      setProjectImage(file);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove the selected image
  const removeImage = () => {
    setProjectImage(null);
    setImagePreview(null);
  };

  // Add this function for form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.projectTitle.trim()) {
      errors.projectTitle = "Project title is required";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (!formData.grantAmount || parseFloat(formData.grantAmount) <= 0) {
      errors.grantAmount = "Valid grant amount is required";
    }
    
    // Check if milestones have valid data
    const milestonesValid = formData.milestones.every(m => 
      m.text.trim() && m.unlockAmount && parseFloat(m.unlockAmount) > 0
    );
    
    if (!milestonesValid) {
      errors.milestones = "All milestones must have a description and valid unlock amount";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to reset the form completely
  const resetForm = () => {
    setIsResetingForm(true);
    
    // Clear all form fields
    setFormData({
      projectTitle: '',
      description: '',
      grantAmount: '',
      githubRepo: '',
      milestones: [{ text: '', unlockAmount: '' }]
    });
    
    // Clear image
    setProjectImage(null);
    setImagePreview(null);
    
    // Clear any form errors
    setFormErrors({});
    
    // Set a small timeout to ensure React state updates complete
    setTimeout(() => {
      setIsResetingForm(false);
    }, 100);
  };

  // Replace the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    console.log("Starting form submission...");

    try {
      // Create a FormData object to handle the file upload
      const submissionData = new FormData();
      
      // Add form data to FormData
      submissionData.append('projectTitle', formData.projectTitle);
      submissionData.append('description', formData.description);
      submissionData.append('grantAmount', formData.grantAmount);
      submissionData.append('githubRepo', formData.githubRepo || '');
      submissionData.append('walletAddress', account?.address || '');
      submissionData.append('milestones', JSON.stringify(formData.milestones));
      
      console.log("Form data prepared, sending to API...");
      console.log("Wallet address:", account?.address || 'Not provided');
      
      // Add the image if it exists
      if (projectImage) {
        try {
          console.log("Adding image to form data:", projectImage.name, projectImage.type, projectImage.size);
          submissionData.append('projectImage', projectImage);
        } catch (imageError) {
          console.error("Error adding image to form data:", imageError);
          // Continue without the image rather than failing the whole submission
        }
      } else {
        console.log("No image selected for upload");
      }

      // Log form data keys for debugging
      console.log("FormData keys:", [...submissionData.keys()]);

      // Send the data to our API endpoint
      const response = await fetch('/api/submit-project', {
        method: 'POST',
        body: submissionData,
      });

      console.log("Response status:", response.status);
      
      // Parse response data
      let responseData;
      try {
        responseData = await response.json();
        console.log("Response data:", responseData);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        throw new Error("Server returned an invalid response");
      }

      if (!response.ok) {
        const errorMessage = responseData.error || responseData.details || 'Failed to submit project';
        console.error("Submission error:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("Form submission successful, resetting form...");
      
      // Reset form completely
      resetForm();

      // Show success message
      toast.success('Proposal submitted for approval', {
        duration: 4000,
        position: 'top-center',
      });
      
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error(`Submission failed: ${error.message}`, {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch user's submissions when account changes
  useEffect(() => {
    if (account) {
      fetchUserSubmissions();
    } else {
      setUserSubmissions([]);
    }
  }, [account]);

  // Function to fetch user submissions
  const fetchUserSubmissions = async () => {
    if (!account) return;
    
    setIsLoadingSubmissions(true);
    setSubmissionsError(null);
    
    try {
      const response = await fetch(`/api/get-user-submissions?walletAddress=${account.address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch your submissions');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUserSubmissions(data.projects);
      } else {
        throw new Error(data.error || 'Failed to fetch your submissions');
      }
    } catch (error) {
      console.error('Error fetching user submissions:', error);
      setSubmissionsError(error.message);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  // Add a function to delete a project
  const deleteProject = async (projectId) => {
    if (!account) return;
    
    if (isDeleting) return;
    
    setIsDeleting(true);
    setDeletingProjectId(projectId);
    
    try {
      const response = await fetch(`/api/delete-project?projectId=${projectId}&walletAddress=${account.address}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Project deleted successfully');
        // Refresh the list of submissions
        fetchUserSubmissions();
      } else {
        toast.error(data.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('An error occurred while deleting the project');
    } finally {
      setIsDeleting(false);
      setDeletingProjectId(null);
    }
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
              <div className="mt-4 pt-4 border-t">
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

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('new');
            }}
            className={`px-6 py-4 rounded-full text-xs tracking-wide font-press-start transition-all ${
              activeTab === 'new'
                ? 'bg-[#F0992A] text-white shadow-md'
                : 'bg-white text-black border border-black hover:bg-gray-100'
            }`}
            style={{ letterSpacing: '0.05em' }}
          >
            New
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              if (account) {
                setActiveTab('mySubmissions');
                fetchUserSubmissions();
              } else {
                toast.error('Please connect your wallet to view your submissions');
              }
            }}
            className={`px-6 py-4 rounded-full text-xs tracking-wide font-press-start transition-all ${
              activeTab === 'mySubmissions'
                ? 'bg-[#F0992A] text-white shadow-md'
                : 'bg-white text-black border border-black hover:bg-gray-100'
            }`}
            style={{ letterSpacing: '0.05em' }}
          >
            My Submissions
          </button>
        </div>

        {/* New Submission Form */}
        {(!account || activeTab === 'new') && (
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
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border ${formErrors.projectTitle ? 'border-red-500' : 'border-black'} focus:ring-2 focus:ring-[#276CBE] text-black font-medium`}
                  placeholder="Enter project title"
                  required
                />
                  {formErrors.projectTitle && (
                    <p className="mt-1 text-red-500 text-sm">{formErrors.projectTitle}</p>
                  )}
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
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border ${formErrors.description ? 'border-red-500' : 'border-black'} focus:ring-2 focus:ring-[#276CBE] text-black font-medium`}
                  placeholder="Describe your project in detail"
                  required
                />
                  {formErrors.description && (
                    <p className="mt-1 text-red-500 text-sm">{formErrors.description}</p>
                  )}
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-lg sm:text-xl mb-2 font-bold text-black">
                    Project Image:
                  </label>
                  <div className="bg-white p-4 rounded-lg border border-black">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Project preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg">
                        <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="mt-2 text-sm text-gray-500">Click to upload an image</span>
                        </label>
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs mt-1 text-black opacity-80">Recommended: Square image (1:1 ratio), max 5MB</p>
              </div>

              <div>
                <label htmlFor="grantAmount" className="block text-lg sm:text-xl mb-2 font-bold text-black">
                    Grant Amount (SUI):
                </label>
                <input
                  type="number"
                  id="grantAmount"
                  name="grantAmount"
                  value={formData.grantAmount}
                  onChange={handleInputChange}
                  style={inputStyle}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border ${formErrors.grantAmount ? 'border-red-500' : 'border-black'} focus:ring-2 focus:ring-[#276CBE] text-black font-medium`}
                    placeholder="Enter requested grant amount"
                  required
                />
                  {formErrors.grantAmount && (
                    <p className="mt-1 text-red-500 text-sm">{formErrors.grantAmount}</p>
                  )}
              </div>

              <div>
                <label htmlFor="githubRepo" className="block text-lg sm:text-xl mb-2 font-bold text-black">
                    GitHub Repository (optional):
                </label>
                <input
                  type="url"
                  id="githubRepo"
                  name="githubRepo"
                  value={formData.githubRepo}
                  onChange={handleInputChange}
                  style={inputStyle}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white border border-black focus:ring-2 focus:ring-[#276CBE] text-black font-medium"
                    placeholder="https://github.com/yourusername/project"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-lg sm:text-xl font-bold text-black">
                      Project Milestones:
                    </label>
                  <button
                    type="button"
                    onClick={addMilestone}
                      className="text-[#276CBE] hover:text-blue-700 bg-white px-2 py-1 rounded-lg flex items-center text-sm font-medium"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Milestone
                  </button>
                </div>
                  <p className="text-sm mb-4 text-black opacity-80">Define clear milestones with their associated unlock amounts.</p>
                  
                  {formErrors.milestones && (
                    <p className="mt-1 mb-3 text-red-500 text-sm">{formErrors.milestones}</p>
                  )}

                <div className="space-y-4">
                  {formData.milestones.map((milestone, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-4 p-3 sm:p-4 bg-white rounded-lg border border-black">
                        <div className="flex-1">
                          <label htmlFor={`milestone-${index}`} className="block mb-1 font-medium text-black">
                          Milestone Description:
                        </label>
                        <textarea
                          id={`milestone-${index}`}
                          value={milestone.text}
                          onChange={(e) => handleMilestoneChange(index, 'text', e.target.value)}
                            style={inputStyle}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-[#276CBE] text-black font-medium"
                            placeholder="Describe what you'll accomplish"
                          rows={2}
                          required
                        />
                      </div>
                        <div className="sm:w-1/3">
                          <label htmlFor={`unlock-${index}`} className="block mb-1 font-medium text-black">
                            Unlock Amount (SUI):
                        </label>
                        <div className="flex">
                          <input
                            type="number"
                              id={`unlock-${index}`}
                            value={milestone.unlockAmount}
                            onChange={(e) => handleMilestoneChange(index, 'unlockAmount', e.target.value)}
                            style={inputStyle}
                              className="flex-1 px-3 py-2 rounded-l-lg bg-white border border-gray-300 focus:ring-2 focus:ring-[#276CBE] text-black font-medium"
                            placeholder="Amount"
                            required
                          />
                            {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeMilestone(index)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 rounded-r-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

                <div className="flex justify-center pt-6">
              <button
                type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-lg text-sm font-press-start bg-white text-black hover:bg-gray-100 transition border border-black ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    style={{ letterSpacing: '0.05em' }}
              >
                    {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </button>
                </div>
            </form>
          )}
        </div>
        )}

        {/* My Submissions Section */}
        {account && activeTab === 'mySubmissions' && (
          <div className="bg-white rounded-xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-black md:w-4/5 mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-black">Your projects are live and gathering support.</h2>
            <p className="mb-6 text-black">Monitor funding status and unlock milestones as you build.</p>
            
            {/* Loading State */}
            {isLoadingSubmissions && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F0992A]"></div>
              </div>
            )}
            
            {/* Error State */}
            {submissionsError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p>Error loading your submissions: {submissionsError}</p>
              </div>
            )}
            
            {/* No Submissions State */}
            {!isLoadingSubmissions && !submissionsError && userSubmissions.length === 0 && (
              <div className="text-center py-12 border-t border-gray-200">
                <p className="text-lg font-semibold text-gray-700">You are yet to make submissions in QuadFund</p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="mt-6 px-6 py-4 bg-[#F0992A] text-white rounded-full text-xs tracking-wide font-press-start hover:bg-[#e08a25] transition-colors"
                  style={{ letterSpacing: '0.05em' }}
                >
                  Create New Project
                </button>
              </div>
            )}
            
            {/* User's Submissions */}
            {!isLoadingSubmissions && !submissionsError && userSubmissions.length > 0 && (
              <div className="space-y-6">
                {userSubmissions.map((project) => (
                  <div key={project.id} className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center">
                      {/* Project Image */}
                      <div className="w-full sm:w-1/4 p-4">
                        <div className="relative w-40 h-40 mx-auto">
                          <Image
                            src={project.imagePath || "/placeholder-project.png"}
                            alt={project.projectTitle}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                      
                      {/* Project Details */}
                      <div className="w-full sm:w-3/4 p-4 sm:p-6 border-t sm:border-t-0 sm:border-l border-gray-300">
                        <h3 className="text-xl font-bold mb-2 text-black">{project.projectTitle}</h3>
                        <p className="text-sm text-gray-700 mb-4">{project.description.substring(0, 150)}...</p>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center">
                            <span className="font-medium text-black">Status:</span>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              project.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              project.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                          </div>
                          
                          <div>
                            <span className="font-medium text-black">Requested:</span>
                            <span className="ml-2 text-black">{project.grantAmount} SUI</span>
                          </div>
                          
                          <div>
                            <span className="font-medium text-black">Submitted:</span>
                            <span className="ml-2 text-black">{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {/* View and Delete Buttons */}
                        <div className="flex gap-2">
                          {project.status === 'approved' ? (
                            <Link 
                              href={`/projects?id=${project.id}`}
                              className="inline-block px-4 py-3 bg-[#F0992A] text-white rounded-md text-xs font-press-start hover:bg-[#e08a25] transition-colors tracking-wide"
                              style={{ letterSpacing: '0.05em' }}
                            >
                              View Project
                            </Link>
                          ) : (
                            <span className="inline-block px-4 py-3 bg-gray-200 text-gray-700 rounded-md text-xs font-press-start tracking-wide"
                              style={{ letterSpacing: '0.05em' }}>
                              Awaiting Approval
                            </span>
                          )}
                          
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                                deleteProject(project.id);
                              }
                            }}
                            disabled={isDeleting && deletingProjectId === project.id}
                            className="inline-block px-4 py-3 bg-red-500 text-white rounded-md text-xs font-press-start hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
                            style={{ letterSpacing: '0.05em' }}
                          >
                            {isDeleting && deletingProjectId === project.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#F0992A] py-4 text-center w-full mt-auto">
        <p className="font-pixel text-xs sm:text-sm text-black">Built for Sui Overflow 2025</p>
        <p className="font-pixel text-xs sm:text-sm text-black">@QuadFund</p>
      </footer>
    </div>
  );
} 