import { useState } from 'react';
import { useCurrentAccount, useWallets } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { toast } from 'react-hot-toast';

// Hard-coded IDs to minimize potential errors
const PACKAGE_ID = '0x9141236514fa080d7d9debe71fd3aac5b2fd5f624f07efccb583dfaea4b5c347';
const PROJECT_ID = '0x436c6ae3b35ca4c22da9facde7ff466fb9be145b2173eeb98b65bde812eb0807';

export default function SimpleVoteButton() {
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
      // Simplified transaction - just donate 1 SUI directly
      const tx = new TransactionBlock();
      
      // Use minimal gas budget
      tx.setGasBudget(5000000); // 0.005 SUI
      
      // Split exactly 1 SUI for donation
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(1_000_000_000)]); // 1 SUI
      
      // Call donate with exactly the params needed
      tx.moveCall({
        target: `${PACKAGE_ID}::quadfund_donation::donate`,
        arguments: [
          tx.object(PROJECT_ID), // project
          coin,                  // payment
          tx.pure(1_000_000_000) // amount (1 SUI)
        ],
      });
      
      console.log('Executing vote transaction with 1 SUI...');
      
      // Find wallet - use exactly the same approach as the test
      if (wallets.length === 0) {
        throw new Error('No wallets available');
      }
      
      const wallet = wallets[0];
      console.log('Using wallet:', wallet.name);
      
      // Execute the same way as the test transaction worked
      if (wallet.features && wallet.features['sui:signAndExecuteTransactionBlock']) {
        const result = await wallet.features['sui:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({
          transactionBlock: tx,
          account,
          chain: 'sui:testnet',
          options: {
            showEffects: true,
          },
        });
        
        console.log('Vote transaction result:', result);
        
        if (result?.effects?.status?.status === 'success') {
          toast.success('Successfully voted with 1 SUI!');
        } else {
          toast.error(`Vote failed: ${result?.effects?.status?.error || 'Unknown error'}`);
        }
      } else {
        throw new Error('Wallet does not support required transaction features');
      }
    } catch (error) {
      console.error('Vote transaction error:', error);
      
      // Handle different error types
      const errorMsg = error.message || 'Failed to send transaction';
      if (errorMsg.includes('balance')) {
        toast.error('Insufficient balance for voting');
      } else if (errorMsg.includes('canceled')) {
        toast('Transaction canceled');
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
      className="bg-[#F0992A] text-white px-12 py-3 rounded-lg text-lg font-medium hover:bg-[#E08819] transition-colors disabled:opacity-50"
    >
      {isLoading ? 'Processing...' : 'Simple Vote (1 SUI)'}
    </button>
  );
} 