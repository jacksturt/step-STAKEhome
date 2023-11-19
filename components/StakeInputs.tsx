import { useState } from "react";
import { Action } from "../pages";
import { IAsyncResult } from "../types";
import DownArrow from "./@icons/downArrow";
import Stake from "./@icons/stake";
import Step from "./@icons/step";
import Unstake from "./@icons/unstake";
import XStepLogo from "./@icons/xstep";

export const StakeInputs = ({
  action,
  setAction,
  stepBalance,
  xStepBalance,
  stepAmount,
  setStepAmount,
  xStepAmount,
  setXStepAmount,
  stepPerXStep,
  xStepPerStep,
}: {
  action: Action;
  setAction: (action: Action) => void;
  stepBalance: IAsyncResult<number>;
  xStepBalance: IAsyncResult<number>;
  stepAmount: number;
  setStepAmount: (amount: number) => void;
  xStepAmount: number;
  setXStepAmount: (amount: number) => void;
  stepPerXStep: number;
  xStepPerStep: number;
}) => {
  const [isStakeHovered, setIsStakeHovered] = useState(false);
  const [isUnstakeHovered, setIsUnstakeHovered] = useState(false);
  return (
    <>
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
          <div className="ml-2 text-sm">Stake</div>
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
          <div className="ml-2 text-sm">Unstake</div>
        </div>
      </div>
      <div className="w-[390px] mt-4 p-7 text-sm bg-shadow rounded-b-lg mb-4">
        <div className="flex mb-2">
          <div className="text-sm">You stake</div>
          <div className="ml-auto text-gray">Balance:</div>
          <div className="ml-1 text-gray font-number">{`${
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
            <div className="ml-2">{`${action === "stake" ? "" : "x"}STEP`}</div>
          </div>
          <input
            type="number"
            id="numberInput"
            className="bg-dark text-white appearance-none border-none  font-number bg-transparent focus:outline-none text-right"
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
          <div className="ml-auto text-gray">Balance:</div>
          <div className="ml-1 font-number text-gray">{`${
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
            className="bg-dark text-white appearance-none border-none  font-number bg-transparent focus:outline-none text-right"
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
    </>
  );
};
