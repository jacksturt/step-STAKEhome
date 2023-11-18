import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DownArrow from "../components/@icons/downArrow";
import Stake from "../components/@icons/stake";
import StakeUnstake from "../components/@icons/stakeUnstake";
import Step from "../components/@icons/step";
import Unstake from "../components/@icons/unstake";
import XStepLogo from "../components/@icons/xstep";
import Layout from "../components/Layout";
import { STEP_TOKEN_ADDRESS, XSTEP_TOKEN_ADDRESS } from "../utils/globals";
import {
  TokenAccountNotFoundError,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { IAsyncResult } from "../types";
import { AnchorProvider, BN } from "@project-serum/anchor";
import { emitPrice, stake } from "../onChain/instructions";

type Action = "stake" | "unstake";

const IndexPage = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [action, setAction] = useState<Action>("stake");
  const [isStakeHovered, setIsStakeHovered] = useState(false);
  const [isUnstakeHovered, setIsUnstakeHovered] = useState(false);
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
  const stakeAmount = action === "stake" ? stepAmount : xStepAmount;
  const stakeBalance =
    action === "stake" ? stepBalance.result : xStepBalance.result;

  useEffect(() => {
    const getStepBalanceAsync = async () => {
      if (!publicKey) {
        return;
      }
      try {
        const usdcAccountAddress = getAssociatedTokenAddressSync(
          new PublicKey(STEP_TOKEN_ADDRESS),
          publicKey
        );
        const usdcAccount = await getAccount(connection, usdcAccountAddress);
        const balance = parseFloat(usdcAccount.amount.toString()) / 10.0 ** 9;
        setStepBalance({ result: balance, isLoading: false });
      } catch (err) {
        if (err instanceof TokenAccountNotFoundError) {
          setStepBalance({ error: err, result: 0 });
        } else {
          console.error(err);
        }
      }
    };
    const getXStepBalanceAsync = async () => {
      if (!publicKey) {
        return;
      }
      try {
        const usdcAccountAddress = getAssociatedTokenAddressSync(
          new PublicKey(XSTEP_TOKEN_ADDRESS),
          publicKey
        );
        const usdcAccount = await getAccount(connection, usdcAccountAddress);
        const balance = parseFloat(usdcAccount.amount.toString()) / 10.0 ** 9;
        setXStepBalance({ result: balance, isLoading: false });
      } catch (err) {
        if (err instanceof TokenAccountNotFoundError) {
          setStepBalance({ error: err, result: 0 });
        } else {
          console.error(err);
        }
      }
    };
    const getPriceRatio = async () => {
      if (!publicKey) {
        return;
      }
      try {
        const provider = new AnchorProvider(
          connection,
          // @ts-ignore:
          window.solana,
          {}
        );
        const ratio = await emitPrice(provider, publicKey, sendTransaction);
        setXStepPerStep(ratio);
        setStepPerXStep(1.0 / ratio);
      } catch (err) {
        console.error(err);
      }
    };
    if (publicKey) {
      getStepBalanceAsync();
      getXStepBalanceAsync();
      getPriceRatio();
    }
  }, [publicKey]);

  return (
    <Layout title="Home | Step STAKEhome">
      <div className="w-full flex flex-col justify-center items-center">
        <div className="flex mt-2 mb-8">
          <StakeUnstake />
          <div className="ml-4 text-xl">Stake Step</div>
        </div>
        <div className="text-gray text-sm">Stake STEP to receive xSTEP</div>
        <div className="w-[390px] mt-10 p-7 text-sm bg-shadow rounded-lg mb-4">
          <div className="flex items-center  mb-7">
            <XStepLogo />
            <div className="ml-2 mr-auto">xSTEP staking APY</div>
            <div>14.41%</div>
          </div>
          <div className="mb-2">"Where is my staking reward?"</div>
          <div className="text-gray">
            xSTEP is a yield bearing asset. This means it is automatically worth
            more STEP over time. You don't need to claim any rewards, or do
            anything other than hold your xSTEP to benefit from this. Later,
            when you unstake your xSTEP you will receive more STEP than you
            initially deposited.
          </div>
        </div>
        <div className="flex w-[390px] h-4">
          <div
            className={
              action === "stake"
                ? "flex items-center rounded-t-md bg-shadow px-7 py-4 text-green cursor-pointer transition-colors duration-200"
                : "flex items-center rounded-t-md bg-dark px-7 py-4 text-gray cursor-pointer hover:text-green transition-colors duration-200"
            }
            onClick={() => {
              setAction("stake");
            }}
            onMouseEnter={() => {
              setTimeout(() => setIsStakeHovered(true), 100);
            }}
            onMouseLeave={() => {
              setTimeout(() => setIsStakeHovered(false), 100);
            }}
          >
            <Stake enabled={action === "stake" || isStakeHovered} />
            <div className="ml-2">Stake</div>
          </div>
          <div
            className={
              action === "unstake"
                ? "flex items-center rounded-t-md bg-shadow px-7 py-4 text-green cursor-pointer transition-colors duration-200"
                : "flex items-center rounded-t-md bg-dark px-7 py-4 text-gray cursor-pointer hover:text-green transition-colors duration-200"
            }
            onClick={() => {
              setAction("unstake");
            }}
            onMouseEnter={() => {
              setTimeout(() => setIsUnstakeHovered(true), 100);
            }}
            onMouseLeave={() => {
              setTimeout(() => setIsUnstakeHovered(false), 100);
            }}
          >
            <Unstake enabled={action === "unstake" || isUnstakeHovered} />
            <div className="ml-2">Unstake</div>
          </div>
        </div>
        <div className="w-[390px] mt-4 p-7 text-sm bg-shadow rounded-b-lg mb-4">
          <div className="flex mb-2">
            <div className="text-sm">You stake</div>
            <div className="ml-auto text-gray">{`Balance: ${
              action === "stake" ? stepBalance.result : xStepBalance.result
            }`}</div>
            <button
              className="bg-darkGreen text-green mx-0.5 ml-2 p-0.5 text-xs rounded-sm hover:bg-green hover:text-black"
              onClick={() => {
                if (action === "stake") {
                  setStepAmount(stepBalance.result / 2);
                  setXStepAmount(
                    parseFloat(
                      ((stepBalance.result / 2) * stepPerXStep).toFixed(9)
                    )
                  );
                } else {
                  setXStepAmount(xStepBalance.result / 2);
                  setStepAmount(
                    parseFloat(
                      ((xStepBalance.result / 2) * xStepPerStep).toFixed(9)
                    )
                  );
                }
              }}
            >
              HALF
            </button>
            <button
              className="bg-darkGreen text-green mx-0.5 p-0.5 text-xs rounded-sm hover:bg-green hover:text-black"
              onClick={() => {
                if (action === "stake") {
                  setStepAmount(stepBalance.result);
                  setXStepAmount(
                    parseFloat((stepBalance.result * stepPerXStep).toFixed(9))
                  );
                } else {
                  setXStepAmount(xStepBalance.result);
                  setStepAmount(
                    parseFloat((xStepBalance.result * xStepPerStep).toFixed(9))
                  );
                }
              }}
            >
              MAX
            </button>
          </div>
          <div className="flex bg-black w-fill h-12 rounded-md p-4">
            <div className="flex items-center mr-auto">
              {action === "stake" ? <Step /> : <XStepLogo />}
              <div className="ml-2">{`${
                action === "stake" ? "" : "x"
              }STEP`}</div>
            </div>
            <input
              type="number"
              id="numberInput"
              className="bg-dark text-white appearance-none border-none  text-center bg-transparent focus:outline-none text-right"
              value={action === "stake" ? stepAmount : xStepAmount}
              onChange={(e) => {
                if (action === "stake") {
                  setStepAmount(
                    parseFloat(parseFloat(e.target.value).toFixed(9))
                  );

                  setXStepAmount(
                    parseFloat(
                      (parseFloat(e.target.value) * stepPerXStep).toFixed(9)
                    )
                  );
                } else {
                  setXStepAmount(
                    parseFloat(parseFloat(e.target.value).toFixed(9))
                  );

                  setStepAmount(
                    parseFloat(
                      (parseFloat(e.target.value) * xStepPerStep).toFixed(9)
                    )
                  );
                }
              }}
            ></input>
          </div>
          <div className="my-2 flex justify-center ">
            <DownArrow />
          </div>
          <div className="flex mb-2">
            <div className="text-sm">You receive</div>
            <div className="ml-auto text-gray">{`Balance: ${
              action === "stake" ? xStepBalance.result : stepBalance.result
            }`}</div>
          </div>
          <div className="flex bg-black w-fill h-12 rounded-md p-4">
            <div className="flex items-center mr-auto">
              {action === "unstake" ? <Step /> : <XStepLogo />}
              <div className="ml-2">{`${
                action === "unstake" ? "" : "x"
              }STEP`}</div>
            </div>
            <input
              type="number"
              id="numberInput"
              className="bg-dark text-white appearance-none border-none  text-center bg-transparent focus:outline-none text-right"
              value={action === "stake" ? xStepAmount : stepAmount}
              onChange={(e) => {
                if (action === "stake") {
                  setStepAmount(
                    parseFloat(parseFloat(e.target.value).toFixed(9))
                  );

                  setXStepAmount(
                    parseFloat(
                      (parseFloat(e.target.value) * stepPerXStep).toFixed(9)
                    )
                  );
                } else {
                  setXStepAmount(
                    parseFloat(parseFloat(e.target.value).toFixed(9))
                  );

                  setStepAmount(
                    parseFloat(
                      (parseFloat(e.target.value) * xStepPerStep).toFixed(9)
                    )
                  );
                }
              }}
            ></input>
          </div>
        </div>

        <button
          className={
            stakeAmount > 0
              ? stakeAmount > stakeBalance
                ? "bg-dusk text-gray cursor-not-allowed w-[390px] h-12 rounded-sm "
                : "bg-darkGreen text-green cursor-pointer w-[390px] h-12 rounded-sm  hover:bg-green hover:text-black transition-colors duration-200"
              : "bg-dusk text-gray cursor-not-allowed w-[390px] h-12 rounded-sm "
          }
          onClick={async () => {
            if (
              stakeAmount > 0 &&
              stakeAmount <= stakeBalance &&
              publicKey &&
              sendTransaction
            ) {
              if (action === "stake") {
                const provider = new AnchorProvider(
                  connection,
                  // @ts-ignore:
                  window.solana,
                  {}
                );
                await stake(
                  provider,
                  publicKey,
                  new BN(stakeAmount * 10 ** 9),
                  sendTransaction
                );
              }
            }
          }}
        >
          {stakeAmount > 0
            ? stakeAmount > stakeBalance
              ? `Insufficient ${action === "stake" ? "" : "x"}STEP balance`
              : "Stake"
            : "Enter Amount"}
        </button>
      </div>
    </Layout>
  );
};

export default IndexPage;
