import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient, useWallets } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { getWallets } from '@mysten/wallet-standard';
import { toast } from 'react-hot-toast';

// Updated package and project IDs from our new deployment
const PACKAGE_ID = '0x9141236514fa080d7d9debe71fd3aac5b2fd5f624f07efccb583dfaea4b5c347';
const PROJECT_ID = '0x436c6ae3b35ca4c22da9facde7ff466fb9be145b2173eeb98b65bde812eb0807';

export default function VoteButton({ onSuccessfulVote }) {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const dappKitWallets = useWallets(); // Use dapp-kit's built-in wallet hook
  const [isLoading, setIsLoading] = useState(false);
  const [showAmountSelector, setShowAmountSelector] = useState(false);
  const [voteAmount, setVoteAmount] = useState(1); // Number of votes
  const [raised, setRaised] = useState(null);
  const [walletError, setWalletError] = useState(null);

  // Quadratic cost calculation
  const quadraticCost = voteAmount * voteAmount;
  const costInMist = quadraticCost * 1_000_000_000;

  // Force reset loading state after 20 seconds to prevent UI getting stuck
  useEffect(() => {
    let timeout;
    if (isLoading) {
      timeout = setTimeout(() => {
        console.log('Force resetting loading state after timeout');
        setIsLoading(false);
        setShowAmountSelector(false);
        setVoteAmount(1);
      }, 20000); // 20 seconds timeout
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Initialize and fetch raised amount
  useEffect(() => {
    if (suiClient && account) {
      fetchRaisedAmount();
    }
  }, [account, suiClient]);

  // Fetch the current amount raised from the contract
  const fetchRaisedAmount = async () => {
    try {
      if (!suiClient) {
        throw new Error('Client not initialized');
      }
      const result = await suiClient.devInspectTransactionBlock({
        sender: account?.address || '0x0',
        transactionBlock: await buildGetRaisedTxb(),
      });
      if (result?.results?.[0]?.returnValues?.[0]) {
        const returnValue = result.results[0].returnValues[0][0];
        const raisedAmount = Number(returnValue) / 1_000_000_000;
        setRaised(raisedAmount);
        return raisedAmount;
      }
    } catch (error) {
      console.error('Error fetching raised amount:', error);
      setWalletError('Failed to fetch raised amount');
    }
    return null;
  };

  // Build transaction block for get_raised
  const buildGetRaisedTxb = async () => {
    const txb = new TransactionBlock();
    txb.moveCall({
      target: `${PACKAGE_ID}::quadfund_donation::get_raised`,
      arguments: [txb.object(PROJECT_ID)],
    });
    return txb;
  };

  // Function to handle the initial vote button click
  const handleVoteClick = () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (walletError) {
      toast.error(walletError);
      return;
    }
    setShowAmountSelector(true);
  };

  // Check if an error is a user rejection/cancellation
  const isUserRejection = (error) => {
    if (!error) return false;
    
    const message = error.message || error.toString();
    return message.toLowerCase().includes('reject') ||
           message.toLowerCase().includes('cancel') ||
           message.toLowerCase().includes('denied') ||
           message.toLowerCase().includes('user rejected') ||
           message.toLowerCase().includes('declined');
  };

  // Check if the error is related to insufficient balance
  const isInsufficientBalanceError = (error) => {
    if (!error) return false;
    
    const message = error.message || error.toString();
    return message.toLowerCase().includes('insufficient') ||
           message.toLowerCase().includes('balance') ||
           message.toLowerCase().includes('coin') ||
           message.toLowerCase().includes('gas') ||
           message.toLowerCase().includes('not enough');
  };

  // Function to find a valid wallet with transaction signing capability
  const findValidWallet = () => {
    try {
      console.log('Current account:', account);
      console.log('DappKit wallets:', dappKitWallets);
      
      // First try using dapp-kit's useWallets hook - this is the preferred method
      if (dappKitWallets && dappKitWallets.length > 0) {
        const currentWallet = dappKitWallets.find(w => 
          w.accounts && w.accounts.some(a => a.address === account?.address)
        );
        
        if (currentWallet) {
          console.log('Found wallet using dapp-kit:', currentWallet.name);
          return currentWallet;
        }
        
        // Use any available wallet from dapp-kit
        const anyWallet = dappKitWallets[0];
        console.log('Using first available dapp-kit wallet:', anyWallet.name);
        return anyWallet;
      }
      
      // Fallback to getWallets() API
      console.log('Falling back to getWallets() API');
      const walletRegistry = getWallets();
      console.log('Wallet registry:', walletRegistry);
      
      // Extract wallets based on the actual structure of the registry
      let wallets = [];
      
      // Check if the registry is an array
      if (Array.isArray(walletRegistry)) {
        wallets = walletRegistry;
      } 
      // Check if it's an object with a get method (like a Map)
      else if (walletRegistry && typeof walletRegistry.get === 'function') {
        // Try to use entries() or values() if available
        if (typeof walletRegistry.entries === 'function') {
          wallets = Array.from(walletRegistry.entries()).map(([_, wallet]) => wallet);
        } else if (typeof walletRegistry.values === 'function') {
          wallets = Array.from(walletRegistry.values());
        } else {
          // Fallback: try to iterate over the object
          wallets = Object.values(walletRegistry);
        }
      }
      // If it's a plain object
      else if (walletRegistry && typeof walletRegistry === 'object') {
        wallets = Object.values(walletRegistry);
      }
      
      console.log('Extracted wallet details:');
      wallets.forEach((wallet, i) => {
        console.log(`Wallet #${i}:`, {
          name: wallet.name,
          icon: wallet.icon,
          chains: wallet.chains,
          accounts: wallet.accounts?.map(a => a.address.slice(0, 10) + '...'),
          features: Object.keys(wallet.features || {})
        });
      });
      
      if (!wallets || wallets.length === 0) {
        throw new Error('No wallets found in registry');
      }
      
      // First try to find a wallet that matches our connected account
      let wallet = null;
      
      // Look for Slush wallet specifically
      wallet = wallets.find(w => 
        w.name && w.name.toLowerCase().includes('slush')
      );
      
      if (wallet) {
        console.log('Found Slush wallet:', wallet.name);
        return wallet;
      }
      
      // Try to find wallet by account address
      for (const w of wallets) {
        if (w.accounts && w.accounts.some(acc => acc.address === account?.address)) {
          wallet = w;
          console.log('Found matching wallet for current account:', wallet.name);
          break;
        }
      }
      
      // If no matching wallet found, try any wallet that has accounts and a signAndExecuteTransactionBlock feature
      if (!wallet) {
        wallet = wallets.find(w => 
          w.accounts && 
          w.accounts.length > 0 && 
          w.features && 
          w.features['sui:signAndExecuteTransactionBlock']
        );
        
        if (wallet) {
          console.log('Using wallet with accounts and sign capability:', wallet.name);
        }
      }
      
      // Fallback to any wallet that appears to support Sui 
      if (!wallet) {
        wallet = wallets.find(w => 
          w.features && 
          w.features['sui:signAndExecuteTransactionBlock']
        );
        
        if (wallet) {
          console.log('Using wallet with Sui features:', wallet.name);
        }
      }
      
      // Last resort - just use the first wallet
      if (!wallet && wallets.length > 0) {
        wallet = wallets[0];
        console.log('Using first available wallet as fallback:', wallet.name);
      }
      
      if (!wallet) {
        throw new Error('No Sui wallet found. Please make sure you have Slush wallet installed and connected.');
      }
      
      return wallet;
      
    } catch (error) {
      console.error('Error finding valid wallet:', error);
      throw error;
    }
  };

  // Function to handle the voting transaction after amount is selected
  const handleVote = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (walletError) {
      toast.error(walletError);
      return;
    }
    setIsLoading(true);
    try {
      // Keep quadratic voting concept but use direct transfer instead
      const quadraticCost = voteAmount * voteAmount;
      const costInMist = quadraticCost * 1_000_000_000;
      
      console.log(`Building transaction: vote=${voteAmount}, cost=${quadraticCost} SUI (quadratic)`);
      
      // Create the transaction block
      const tx = new TransactionBlock();
      
      // Set minimal gas budget
      tx.setGasBudget(5000000); // 0.005 SUI
      
      // Split the quadratic amount for donation
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(costInMist)]);
      
      // Direct transfer to project owner (bypass contract issues)
      // This keeps the quadratic voting UI but uses direct transfers
      const PROJECT_OWNER = '0x01ca3eb4de5a38ff8f59ab783a29964798282945cb56ba27cd12a7054a7d5865';
      tx.transferObjects([coin], tx.pure(PROJECT_OWNER));
      
      console.log('Using direct transfer with quadratic cost for demo');
      
      // Find wallet and execute transaction
      if (dappKitWallets.length === 0) {
        throw new Error('No wallets available');
      }
      
      const wallet = dappKitWallets[0];
      console.log('Using wallet:', wallet.name);
      
      if (wallet.features && wallet.features['sui:signAndExecuteTransactionBlock']) {
        const response = await wallet.features['sui:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({
          transactionBlock: tx,
          account,
          chain: 'sui:testnet',
          options: {
            showEffects: true,
          },
        });
        
        console.log('Transaction response:', response);
        
        if (response?.effects?.status?.status !== 'success') {
          const errorCode = response?.effects?.status?.error || '';
          const digest = response?.digest || '';
          
          console.error('Transaction failed with details:', {
            status: response?.effects?.status,
            digest,
            errorCode
          });
          
          let errorMessage = 'Transaction failed';
          if (errorCode.includes('InsufficientGas') || errorCode.includes('gas')) {
            errorMessage = 'Not enough SUI to cover gas fees. Please get testnet SUI from the faucet.';
          } else if (errorCode.includes('coin') || errorCode.includes('balance')) {
            errorMessage = 'Insufficient balance. Please make sure you have enough SUI.';
          } else if (errorCode) {
            errorMessage = `Transaction failed: ${errorCode}`;
          } else {
            errorMessage = 'Transaction failed. Please try again or check your wallet balance.';
          }
          
          throw new Error(errorMessage);
        }

        toast.success(`Successfully voted with ${quadraticCost} SUI!`);
        
        // Simulate updated amount for demo
        // In a real app, this would come from the contract
        const updatedAmount = (raised || 0) + quadraticCost;
        setRaised(updatedAmount);
        
        // Update votes in Supabase database
        try {
          const response = await fetch('/api/update-votes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              projectId: PROJECT_ID,
              voteAmount: quadraticCost, // Using the quadratic cost as the vote amount
            }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            console.error('Failed to update votes in database:', data.error);
          } else {
            console.log('Votes updated in database:', data);
          }
        } catch (dbError) {
          console.error('Error updating votes in database:', dbError);
          // We don't fail the transaction if the database update fails
          // The blockchain transaction was already successful
        }
        
        if (onSuccessfulVote) {
          onSuccessfulVote(quadraticCost, null);
        }
      } else {
        throw new Error('Wallet does not support required transaction features');
      }
      
      setIsLoading(false);
      setShowAmountSelector(false);
      setVoteAmount(1);
    } catch (error) {
      console.error('Transaction error:', error);
      
      // Check if this is a user rejection/cancellation
      if (isUserRejection(error)) {
        toast('Transaction cancelled');
        console.log('User cancelled the transaction');
      } 
      // Check if this is an insufficient balance error
      else if (isInsufficientBalanceError(error)) {
        toast.error('Insufficient balance. Please get testnet SUI from the faucet.');
        setWalletError('Insufficient SUI balance');
      }
      // Unknown error - provide a more helpful message
      else if (error.message?.includes('Unknown error')) {
        toast.error('Transaction failed. Please check your wallet has testnet SUI and try again.');
        setWalletError('Transaction failed - please check wallet balance');
      }
      // Standard error handling
      else {
        toast.error(`Error: ${error.message || 'Failed to send transaction'}`);
        setWalletError(error.message || 'Transaction failed');
      }
      
      setIsLoading(false);
      setShowAmountSelector(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowAmountSelector(false);
    setVoteAmount(1);
  };

  // Add a reset function
  const handleReset = () => {
    console.log('Manual reset triggered');
    setIsLoading(false);
    setShowAmountSelector(false);
    setVoteAmount(1);
    setWalletError(null);
  };

  if (showAmountSelector) {
    return (
      <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
        <p className="text-center mb-3 text-black font-normal">Select number of votes:</p>
        <div className="flex items-center mb-2 rounded-lg overflow-hidden shadow-md">
          <button 
            onClick={() => setVoteAmount(Math.max(1, voteAmount - 1))}
            className="bg-[#F0992A] hover:bg-[#E08819] text-white px-6 py-3 text-xl font-medium"
            disabled={voteAmount <= 1 || isLoading}
          >
            -
          </button>
          <div className="px-10 py-3 bg-[#F0992A] text-white text-center text-2xl font-normal min-w-[120px]">
            {voteAmount} vote{voteAmount > 1 ? 's' : ''}
          </div>
          <button 
            onClick={() => setVoteAmount(voteAmount + 1)}
            className="bg-[#F0992A] hover:bg-[#E08819] text-white px-6 py-3 text-xl font-medium"
            disabled={isLoading}
          >
            +
          </button>
        </div>
        <div className="mb-4 text-sm text-black font-normal">
          Quadratic Cost: <span className="font-bold">{quadraticCost} SUI</span>
        </div>
        {walletError && (
          <div className="mb-3 text-sm text-red-500">
            {walletError}
          </div>
        )}
        <div className="flex gap-2 w-full">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50 flex-1 border border-black"
          >
            Cancel
          </button>
          <button
            onClick={handleVote}
            disabled={isLoading}
            className="bg-[#F0992A] text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-[#E08819] transition-colors disabled:opacity-50 flex-1 border border-black"
          >
            {isLoading ? 'Processing...' : `Confirm (${quadraticCost} SUI)`}
          </button>
        </div>
        {/* Add reset button for emergency cases */}
        {isLoading && (
          <button
            onClick={handleReset}
            className="mt-3 text-xs text-red-500 underline"
          >
            Reset (if stuck)
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleVoteClick}
      disabled={isLoading || !account || !!walletError}
      className="bg-[#F0992A] text-white px-16 py-3 rounded-lg text-lg font-medium hover:bg-[#E08819] transition-colors disabled:opacity-50 border border-black min-w-[200px] w-64"
    >
      {walletError ? 'Wallet Error' : account ? 'Vote' : 'Connect Wallet First'}
    </button>
  );
} 