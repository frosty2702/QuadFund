import { useState } from 'react';
import { useCurrentAccount, useSuiClient, useWallets } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { toast } from 'react-hot-toast';

export default function TestTxButton() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const wallets = useWallets();
  const [isLoading, setIsLoading] = useState(false);

  const handleTestTransaction = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // Log the available wallets and features
      console.log('Available wallets:', wallets.length);
      if (wallets.length > 0) {
        const wallet = wallets[0];
        console.log('First wallet:', {
          name: wallet.name,
          accounts: wallet.accounts?.map(a => a.address.slice(0, 10) + '...'),
          features: Object.keys(wallet.features || {})
        });
      }

      // Create a simplified transaction
      const tx = new TransactionBlock();
      tx.setSender(account.address);
      
      // Just do a simple split and merge to test transaction functionality
      // We're not actually transferring any SUI, just validating transaction ability
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(100)]); // Just 100 MIST (0.0000001 SUI)
      tx.mergeCoins(tx.gas, [coin]); // Merge it back
      
      // Set a reasonable gas budget
      tx.setGasBudget(10000000);
      
      console.log('Transaction block created:', tx);
      
      // Use the traditional approach that should work with most wallets
      // This combines signing and execution in one step
      if (wallets.length === 0) {
        throw new Error('No wallets available');
      }
      
      // Use the wallet directly
      const wallet = wallets[0];
      console.log('Using wallet:', wallet.name);
      
      // Look in features to find the correct method - newer dapp-kit changed the API
      if (wallet.features && wallet.features['sui:signAndExecuteTransactionBlock']) {
        console.log('Using sui:signAndExecuteTransactionBlock feature');
        
        const result = await wallet.features['sui:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({
          transactionBlock: tx,
          account,
          chain: 'sui:testnet',
          options: {
            showEffects: true,
          },
        });
        
        console.log('Transaction result:', result);
        
        if (result?.effects?.status?.status === 'success') {
          toast.success('Test transaction successful!');
        } else {
          toast.error(`Test failed: ${result?.effects?.status?.error || 'Unknown error'}`);
        }
      } else {
        console.error('Wallet does not support signAndExecuteTransactionBlock');
        console.log('Available features:', wallet.features ? Object.keys(wallet.features) : 'none');
        throw new Error('Wallet does not support required features');
      }
    } catch (error) {
      console.error('Test transaction error:', error);
      toast.error(`Error: ${error.message || 'Failed to send test transaction'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleTestTransaction}
      disabled={isLoading || !account}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
    >
      {isLoading ? 'Testing...' : 'Test Transaction'}
    </button>
  );
} 