import "../styles/globals.css";
import "@mysten/dapp-kit/dist/index.css";

import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";
import { useEffect } from "react";

import { Plus_Jakarta_Sans, Press_Start_2P } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});

const { networkConfig } = createNetworkConfig({
  testnet: {
    url: "https://fullnode.testnet.sui.io",
    websocket: "wss://fullnode.testnet.sui.io:443",
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      onError: (error) => {
        if (error?.message?.includes('rejected') || 
            error?.message?.includes('cancel') ||
            error?.message?.includes('User rejected')) {
          toast.info('Transaction cancelled');
          console.log('User cancelled transaction:', error);
          return;
        }
        
        console.error('Query error:', error);
      }
    },
    mutations: {
      onError: (error) => {
        if (error?.message?.includes('rejected') || 
            error?.message?.includes('cancel') ||
            error?.message?.includes('User rejected')) {
          toast.info('Transaction cancelled');
          console.log('User cancelled transaction:', error);
          return;
        }
        
        console.error('Mutation error:', error);
      }
    }
  },
});

const GlobalErrorHandler = () => {
  useEffect(() => {
    const handleError = (event) => {
      const error = event.error || event.reason;
      
      if ((error?.name === 'TRPCClientError' || 
           error?.message?.includes('TRPC')) && 
          (error?.message?.includes('rejected') || 
           error?.message?.includes('User rejected'))) {
        
        event.preventDefault();
        
        toast.info('Transaction cancelled');
        console.log('Intercepted TRPC error:', error);
      }
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);
  
  return null;
};

export default function App({ Component, pageProps }) {
  return (
    <div className={`${plusJakarta.variable} ${pressStart.variable}`}>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider 
            autoConnect 
            preferredWallets={['slush']}
            onError={(error) => {
              console.error('Wallet connection error:', error);
            }}
          >
            <Toaster position="top-right" />
            <GlobalErrorHandler />
            <Component {...pageProps} />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </div>
  );
}
