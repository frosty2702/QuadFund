import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'react-hot-toast';

export default function AdminPage() {
  const account = useCurrentAccount();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all projects
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/debug-database?wallet=${account?.address || ''}`);
        const data = await response.json();
        
        if (data.tableExists && data.projects) {
          setProjects(data.projects);
        }
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllProjects();
  }, [account]);

  // Approve a project
  const approveProject = async (projectId) => {
    try {
      toast.loading('Approving project...', { id: 'approval-toast' });
      
      const response = await fetch('/api/approve-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });
      
      const data = await response.json();
      
      toast.dismiss('approval-toast');
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve project');
      }
      
      toast.success('Project approved successfully');
      
      // Refresh the project list
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return { ...project, approved: true, status: 'approved' };
        }
        return project;
      });
      
      setProjects(updatedProjects);
    } catch (error) {
      toast.dismiss('approval-toast');
      toast.error(`Error: ${error.message}`);
    }
  };

  // Add a function to fix all projects
  const fixAllProjects = async () => {
    try {
      toast.loading('Fixing all projects...', { id: 'fix-toast' });
      
      const response = await fetch('/api/admin/fix-projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      toast.dismiss('fix-toast');
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fix projects');
      }
      
      toast.success(data.message || 'Projects fixed successfully');
      
      // Refresh the project list after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.dismiss('fix-toast');
      toast.error(`Error: ${error.message}`);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-4">Please connect your wallet to access the admin dashboard</p>
        <ConnectButton />
      </div>
    );
  }

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
        
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        
        <div className="w-1/4 text-right">
          <ConnectButton />
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex-grow w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">All Projects</h2>
          <div className="flex gap-4">
            <button
              onClick={fixAllProjects}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Fix All Projects
            </button>
            <Link 
              href="/projectlist"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              View Live Projects
            </Link>
            <Link 
              href="/submissions"
              className="px-4 py-2 bg-[#F0992A] text-white rounded-md"
            >
              New Submission
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F0992A]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.project_title || project.projectTitle}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.grant_amount || project.grantAmount} SUI
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status || (project.approved ? 'approved' : 'pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-sm text-gray-900 truncate max-w-[200px]">
                        {project.wallet_address || project.walletAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!project.approved && (
                        <button
                          onClick={() => approveProject(project.id)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Approve
                        </button>
                      )}
                      <Link
                        href={`/projects?id=${project.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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