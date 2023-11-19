import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import Connect from "../components/@icons/connect";
import Layout from "../components/Layout";
import { STEP_TOKEN_ADDRESS, XSTEP_TOKEN_ADDRESS } from "../utils/globals";
import {
  TokenAccountNotFoundError,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { IAsyncResult } from "../types";
import { emitPrice } from "../onChain/instructions";
export type Action = "stake" | "unstake";
import { StaticInfo } from "../components/StaticInfo";
import { StakeInputs } from "../components/StakeInputs";
import { StakeButton } from "../components/StakeButton";
export const TOKEN_ACCOUNT_NOT_INITIALIZED_ERROR =
  "Token Account Not Initialized";

const getTokenAccountBalance = async (
  publicKey: PublicKey,
  connection: Connection,
  tokenAddress: PublicKey,
  setTokenBalance: (balance: IAsyncResult<number>) => void
) => {
  try {
    const tokenAccountAddress = getAssociatedTokenAddressSync(
      new PublicKey(tokenAddress),
      publicKey
    );
    const tokenAccount = await getAccount(connection, tokenAccountAddress);
    const balance = parseFloat(tokenAccount.amount.toString()) / 10.0 ** 9;
    setTokenBalance({ result: balance, isLoading: false });
  } catch (err) {
    if (err instanceof TokenAccountNotFoundError) {
      setTokenBalance({
        error: new Error(TOKEN_ACCOUNT_NOT_INITIALIZED_ERROR),
        result: 0,
      });
    } else {
      setTokenBalance({
        error: err,
        result: 0,
      });
      console.error(err);
    }
  }
};

const IndexPage = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [action, setAction] = useState<Action>("stake");
  const [stepBalance, setStepBalance] = useState<IAsyncResult<number>>({
    isLoading: true,
    result: 0,
  });
  const [xStepBalance, setXStepBalance] = useState<IAsyncResult<number>>({
    isLoading: true,
    result: 0,
  });

  const [stepAmount, setStepAmount] = useState(0.0);
  const [xStepAmount, setXStepAmount] = useState(0.0);
  const [stepPerXStep, setStepPerXStep] = useState(1.24);
  const [xStepPerStep, setXStepPerStep] = useState(1.0 / 1.24);

  const getStepBalanceAsync = async () => {
    if (!publicKey) {
      return;
    }
    getTokenAccountBalance(
      publicKey,
      connection,
      new PublicKey(STEP_TOKEN_ADDRESS),
      setStepBalance
    );
  };
  const getXStepBalanceAsync = async () => {
    if (!publicKey) {
      return;
    }
    getTokenAccountBalance(
      publicKey,
      connection,
      new PublicKey(XSTEP_TOKEN_ADDRESS),
      setXStepBalance
    );
  };
  const getPriceRatio = async () => {
    try {
      const ratio = await emitPrice(connection);
      setXStepPerStep(ratio);
      setStepPerXStep(1.0 / ratio);
    } catch (err) {
      console.error(err);
    }
  };
  const getAllInfo = async () => {
    getStepBalanceAsync();
    getXStepBalanceAsync();
    getPriceRatio();
  };
  useEffect(() => {
    if (publicKey) {
      getAllInfo();
    }
  }, [publicKey]);

  return (
    <Layout title="Home | Step STAKEhome">
      <div className="w-full flex flex-col justify-center items-center">
        {publicKey ? (
          <>
            <StaticInfo />
            <StakeInputs
              action={action}
              setAction={setAction}
              stepBalance={stepBalance}
              xStepBalance={xStepBalance}
              stepAmount={stepAmount}
              setStepAmount={setStepAmount}
              xStepAmount={xStepAmount}
              setXStepAmount={setXStepAmount}
              stepPerXStep={stepPerXStep}
              xStepPerStep={xStepPerStep}
            />
            <StakeButton
              action={action}
              stepBalance={stepBalance}
              xStepBalance={xStepBalance}
              stepAmount={stepAmount}
              xStepAmount={xStepAmount}
              getAllInfo={getAllInfo}
            />
          </>
        ) : (
          <div className="w-full h-[90vh] flex items-center justify-center flex-col">
            <Connect />
            <div className="mt-4">Connect your wallet to begin</div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;
