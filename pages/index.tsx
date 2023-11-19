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
import { showNotification } from "../utils/notifications";
import { Notification } from "../components/Notification";

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
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const [action, setAction] = useState<Action>("stake");
  // Store the user's balances for STEP, xSTEP
  const [stepBalance, setStepBalance] = useState<IAsyncResult<number>>({
    isLoading: true,
    result: 0,
  });
  const [xStepBalance, setXStepBalance] = useState<IAsyncResult<number>>({
    isLoading: true,
    result: 0,
  });
  // Store the values for the two inputs
  const [stepAmount, setStepAmount] = useState(0.0);
  const [xStepAmount, setXStepAmount] = useState(0.0);
  // Store the ratio of STEP to xSTEP, and vice-versa. Verbose for readability
  const [stepPerXStep, setStepPerXStep] = useState(1.24);
  const [xStepPerStep, setXStepPerStep] = useState(1.0 / 1.24);
  // Variables for cleanly handling connect and disconnect notifactions
  const [previousPublicKey, setPreviousPublicKey] = useState<PublicKey>(null);
  const [hasSentConnectedNotifcation, setHasSentConnectedNotifaction] =
    useState(false);
  const [hasSentDisconnectedNotifcation, setHasSentDisconnectedNotifaction] =
    useState(false);
  const [previousDisconnectListener, setPreviousDisconnectListner] =
    useState(null);

  const getStepBalanceAsync = async () => {
    if (!publicKey && !stepBalance.error) {
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
    if (!publicKey && !xStepBalance.error) {
      return;
    }
    getTokenAccountBalance(
      publicKey,
      connection,
      new PublicKey(XSTEP_TOKEN_ADDRESS),
      setXStepBalance
    );
  };
  // get and store ratio of STEP to xSTEP and vice versa
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

  // state management for wallet connect and disconnect actions
  useEffect(() => {
    if (wallet) {
      wallet.adapter.addListener("connect", async () => {
        if (wallet.adapter.publicKey && !hasSentConnectedNotifcation) {
          setHasSentConnectedNotifaction(true);
          // need to make a deep copy of the public key, because if we connect and disconnect quickly,
          // the reference in the notifcation will be null, and cause an error
          const deepCopyPK = new PublicKey(wallet.adapter.publicKey);
          showNotification(() => (
            <Notification
              type="connect"
              icon={wallet.adapter.icon}
              publicKey={deepCopyPK}
            />
          ));
          setPreviousPublicKey(deepCopyPK);
        }
      });
      // need to keep track of previous disconnect listeners, and clear them as to not send a notification for each
      // wallet that was connected at some point
      if (previousDisconnectListener) {
        wallet.adapter.removeListener(previousDisconnectListener);
      }
      const disconnectedListener = wallet.adapter.addListener(
        "disconnect",
        () => {
          if (previousPublicKey && !hasSentDisconnectedNotifcation) {
            setHasSentDisconnectedNotifaction(true);

            showNotification(() => (
              <Notification type="disconnect" publicKey={previousPublicKey} />
            ));
          }
        }
      );
      setPreviousDisconnectListner(disconnectedListener);
    }
  }, [wallet, previousPublicKey]);

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
