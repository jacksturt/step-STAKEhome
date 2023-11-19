import { AnchorProvider, BN } from "@project-serum/anchor";
import { TransactionConfirmationStrategy } from "@solana/web3.js";
import { useState } from "react";
import { Action, TOKEN_ACCOUNT_NOT_INITIALIZED_ERROR } from "../pages";
import { IAsyncResult } from "../types";
import { Notification } from "./Notification";
import { stake, unstake } from "../onChain/instructions";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { showNotification } from "../utils/notifications";

export const StakeButton = ({
  action,
  stepBalance,
  xStepBalance,
  stepAmount,
  xStepAmount,
  getAllInfo,
}: {
  action: Action;
  stepBalance: IAsyncResult<number>;
  xStepBalance: IAsyncResult<number>;
  stepAmount: number;
  xStepAmount: number;
  getAllInfo: () => void;
}) => {
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const stakeAmount = action === "stake" ? stepAmount : xStepAmount;
  const receiveAmount = action === "stake" ? xStepAmount : stepAmount;
  const stakeBalance =
    action === "stake" ? stepBalance.result : xStepBalance.result;

  return (
    <button
      className={
        stakeAmount > 0 && stakeAmount < stakeBalance && !isTransactionPending
          ? "bg-darkGreen text-green cursor-pointer w-[390px] h-12 rounded-sm  hover:bg-green hover:text-black transition-colors duration-200"
          : "bg-dusk text-gray cursor-not-allowed w-[390px] h-12 rounded-sm "
      }
      onClick={async () => {
        if (stakeAmount > 0 && stakeAmount <= stakeBalance && publicKey) {
          const provider = new AnchorProvider(
            connection,
            // @ts-ignore:
            window.solana,
            {}
          );
          let signature: TransactionConfirmationStrategy;
          setIsTransactionPending(true);
          showNotification(() => (
            <Notification
              type="info"
              title="Approve transactions from your wallet"
            />
          ));
          try {
            if (action === "stake") {
              signature = await stake(
                provider,
                publicKey,
                new BN(stakeAmount * 10 ** 9),
                sendTransaction,
                // check if we need to initialize the toTokenAccount
                xStepBalance.result === 0 &&
                  xStepBalance.error.message ===
                    TOKEN_ACCOUNT_NOT_INITIALIZED_ERROR
              );
              showNotification(() => (
                <Notification
                  type="info"
                  title="You are staking step"
                  message="confirmation in progress"
                  signature={signature.signature}
                />
              ));
            } else {
              signature = await unstake(
                provider,
                publicKey,
                new BN(stakeAmount * 10 ** 9),
                sendTransaction,
                // check if we need to initialize the toTokenAccount
                stepBalance.result === 0 &&
                  stepBalance.error.message ===
                    TOKEN_ACCOUNT_NOT_INITIALIZED_ERROR
              );
              showNotification(() => (
                <Notification
                  type="info"
                  title="You are staking step"
                  message="confirmation in progress"
                  signature={signature.signature}
                />
              ));
            }
            setIsTransactionPending(false);
            await connection.confirmTransaction(signature);
            getAllInfo();
            showNotification(() => (
              <Notification
                type="success"
                action={action}
                signature={signature.signature}
                stakeAmount={stakeAmount}
                receiveAmount={receiveAmount}
              />
            ));
          } catch (e) {
            setIsTransactionPending(false);
            showNotification(() => (
              <Notification
                type="error"
                title="There was an error"
                message={e.message}
              />
            ));
          }
        }
      }}
    >
      {isTransactionPending
        ? // Approve transaction window is open
          "Approve Transactions From Your Wallet"
        : stakeAmount > 0
        ? stakeAmount > stakeBalance
          ? // User does not have sufficient balance to make request based on input balance
            `Insufficient ${action === "stake" ? "" : "x"}STEP balance`
          : // The user has entered a valid amount to stake or unstake
            `${action === "stake" ? "S" : "Uns"}take`
        : // The use has not entered an amount yet
          "Enter Amount"}
    </button>
  );
};
