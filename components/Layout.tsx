import React, { ReactNode } from "react";
import Head from "next/head";
import StepLogo from "./@icons/logo";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
const DynamicMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => {
  const { publicKey } = useWallet();
  return (
    <div className="w-100vw h-max">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <div className="w-[100vw] h-16 pt-2 flex align-center">
          <div className="ml-4 mr-auto">
            <StepLogo />
          </div>
          {/* Causes a typescript error, but not a compilation error. Works as intended. */}
          {/* @ts-ignore  */}
          <DynamicMultiButton startIcon={undefined}>
            {publicKey
              ? publicKey.toBase58().slice(0, 4) +
                " ... " +
                publicKey.toBase58().slice(-4)
              : "Connect"}
          </DynamicMultiButton>
        </div>
      </header>
      {children}
    </div>
  );
};

export default Layout;
