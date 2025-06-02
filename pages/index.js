import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage() {
  const account = useCurrentAccount();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      console.log("✅ Wallet already connected — redirecting to homepage...");
      router.push("/homepage");
      
    }
  }, [account, router]);

  return (
    <div className="flex flex-col md:flex-row h-screen font-inter">
      {/* Left Section - Nuclear Mango */}
      <div className="w-full md:w-1/2 bg-[#F0992A] flex items-center justify-center p-6 md:p-10 min-h-[40vh] md:min-h-full">
        <p className="text-[#276CBE] text-sm sm:text-base md:text-lg font-jakarta text-center md:text-left leading-relaxed tracking-wide">
          Fund the Future,<br />
          One Vote at a Time.
        </p>
      </div>

      {/* Right Section - White */}
      <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-6 md:p-10">
        <ConnectButton
          className="border border-black rounded-full px-4 sm:px-8 py-2 text-sm font-medium hover:bg-gray-100 transition flex items-center gap-2"
          label="Connect to Sui Wallet"
          icon={<img src="/logo.webp" alt="Sui Logo" className="w-5 h-5" />}
          network="testnet"
        />

        <p className="text-xs sm:text-[13px] text-center text-[#3188EE] max-w-xs mt-4">
          Why Connect to Sui? <br />
          QuadFund uses your Sui Wallet to securely verify your identity, submit proposals,
          vote for creators, and cast votes. <br />
          No passwords. No accounts. Just seamless, trustless access.
        </p>

        <a
          href="#"
          className="mt-4 text-xs sm:text-[12px] text-[#3188EE] underline hover:text-blue-800"
        >
          Wish to Explore QuadFund? Click here to continue without an account
        </a>
      </div>
    </div>
  );
}

