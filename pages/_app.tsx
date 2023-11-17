// pages/_app.tsx
import { AppProps } from "next/app";
import React from "react";
import "../styles/globals.css"; // Import your global styles here
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { MAINNET_RPC } from "../utils/globals";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConnectionProvider
      endpoint={MAINNET_RPC}
      config={{ commitment: "confirmed" }}
    >
      <WalletProvider wallets={[new PhantomWalletAdapter()]} autoConnect>
        <WalletModalProvider>
          <div className="bg-black h-[100vh] w-[100vw] text-white">
            {/* Causes a typescript error, but not a compilation error. Works as intended. */}
            {/* @ts-ignore  */}
            <Component {...pageProps} />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
