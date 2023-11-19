import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, TransactionConfirmationStrategy } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import DownArrow from "../components/@icons/downArrow";
import Stake from "../components/@icons/stake";
import StakeUnstake from "../components/@icons/stakeUnstake";
import Step from "../components/@icons/step";
import Unstake from "../components/@icons/unstake";
import XStepLogo from "../components/@icons/xstep";
import Connect from "../components/@icons/connect";
import Layout from "../components/Layout";
import { STEP_TOKEN_ADDRESS, XSTEP_TOKEN_ADDRESS } from "../utils/globals";
import {
  TokenAccountNotFoundError,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { IAsyncResult } from "../types";
import { AnchorProvider, BN } from "@project-serum/anchor";
import { emitPrice, stake, unstake } from "../onChain/instructions";
import { ElementType, notification } from "antd-notifications-messages";
import { Notification } from "../components/Notification";
export type Action = "stake" | "unstake";

const IndexPage = () => {
  return (
    <Layout title="Home | Step STAKEhome">
      <div className="w-full flex flex-col justify-center items-center">
        <Notification
          type="info"
          title="You are staking step"
          message="confirmation in progress"
          signature="2uqRkH626iK3Nf2iUmQFhUnnSPe31krQPrg7k8pa62fjuuZgURhPu39f2NrAiuhHpThvmp9KM4ZGqjvVnKm6eayc"
        />
        <Notification
          type="error"
          title="There was an error"
          message="user cancelled the transaction"
        />
        <Notification
          type="success"
          title="There was an error"
          message="user cancelled the transaction"
          stakeAmount={1.015}
          receiveAmount={0.892}
          action="stake"
          signature="2uqRkH626iK3Nf2iUmQFhUnnSPe31krQPrg7k8pa62fjuuZgURhPu39f2NrAiuhHpThvmp9KM4ZGqjvVnKm6eayc"
        />
      </div>
    </Layout>
  );
};

export default IndexPage;
