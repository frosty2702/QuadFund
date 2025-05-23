import { useState } from 'react';
import { useCurrentAccount, useWallets } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { toast } from 'react-hot-toast';

// Hard-coded IDs
const PROJECT_OWNER = '0x01ca3eb4de5a38ff8f59ab783a29964798282945cb56ba27cd12a7054a7d5865';

export default function DirectVoteButton() {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // Completely different approach - just directly transfer SUI to project owner
      const tx = new TransactionBlock();
      
      // Use minimal gas budget
      tx.setGasBudget(2000000); // 0.002 SUI
      
      // Split exactly 1 SUI for donation
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(1_000_000_000)]); // 1 SUI
      
      // Just transfer directly to the project owner instead of using smart contract
      tx.transferObjects([coin], tx.pure(PROJECT_OWNER));
      
      console.log('Executing direct transfer of 1 SUI to project owner...');
      
      // Find wallet
      if (wallets.length === 0) {
        throw new Error('No wallets available');
      }
      
      const wallet = wallets[0];
      console.log('Using wallet:', wallet.name);
      
      // Execute transaction
      if (wallet.features && wallet.features['sui:signAndExecuteTransactionBlock']) {
        const result = await wallet.features['sui:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({
          transactionBlock: tx,
          account,
          chain: 'sui:testnet',
          options: {
            showEffects: true,
          },
        });
        
        console.log('Direct transfer result:', result);
        
        if (result?.effects?.status?.status === 'success') {
          toast.success('Successfully donated 1 SUI directly!');
        } else {
          toast.error(`Transfer failed: ${result?.effects?.status?.error || 'Unknown error'}`);
        }
      } else {
        throw new Error('Wallet does not support required transaction features');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      
      // Handle different error types
      const errorMsg = error.message || 'Failed to send transaction';
      if (errorMsg.includes('balance')) {
        toast.error('Insufficient balance for donation');
      } else if (errorMsg.includes('canceled')) {
        toast.info('Transaction canceled');
      } else {
        toast.error(`Error: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={isLoading || !account}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      {isLoading ? 'Sending...' : 'Direct Donate (1 SUI)'}
    </button>
  );
} 