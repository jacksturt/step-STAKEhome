import { ElementType } from "antd-notifications-messages";
import { Action } from "../pages";
import CheckMark from "./@icons/CheckMark";
import Ellipses from "./@icons/Ellipses";
import ExternalLinkIcon from "./@icons/ExternalLinkIcon";
import Step from "./@icons/step";
import XMark from "./@icons/XMark";
import XStepLogo from "./@icons/xstep";

export const Notification = ({
  title,
  message,
  type,
  action,
  stakeAmount,
  receiveAmount,
  signature,
}: {
  type: ElementType;
  title?: string;
  message?: string;
  action?: Action;
  stakeAmount?: number;
  receiveAmount?: number;
  signature?: string;
}) => {
  switch (type) {
    case "info":
      return (
        <div className="flex bg-dawn rounded-lg p-6 mt-8">
          <div className="mr-6 flex justify-center items-center">
            <Ellipses />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white">{title}</h1>
            {message && <div className="text-gray text-sm mt-2">{message}</div>}
            {signature && (
              <div className="ml-28 mt-2 text-xs flex border-solid p-1 border rounded-sm border-gray gap-2 justify-center items-center text-green">
                <a
                  className=""
                  href={`https://solscan.io/tx/${signature}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  View on Solscan
                </a>
                <ExternalLinkIcon />
              </div>
            )}
          </div>
        </div>
      );
    case "error":
      return (
        <div className="flex bg-dawn rounded-lg p-6 mt-8">
          <div className="mr-6 flex justify-center items-center">
            <XMark />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white">{title}</h1>
            <div className="text-gray text-sm mt-2">{message}</div>
          </div>
        </div>
      );
    case "success":
      return (
        <div className="flex bg-dawn rounded-lg p-6 mt-8">
          <div className="mr-6 flex justify-center items-center">
            <CheckMark />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white">
              {action === "stake" ? "You staked Step" : "You unstaked xSTEP"}
            </h1>
            <div className="text-gray text-sm mt-2">
              {action === "stake" ? "You staked:" : "You unstaked:"}
            </div>
            <div className="flex ml-1 items-center mt-2">
              <div className="text-green mr-3 text-xl">-</div>
              <div className="flex gap-3 justify-center items-center text-white">
                {action === "stake" ? <Step /> : <XStepLogo />}
                <div className="text-lightGray">{stakeAmount.toFixed(9)}</div>
                {action === "stake" ? "STEP" : "xSTEP"}
              </div>
            </div>
            <div className="text-gray text-sm mt-2">You received:</div>

            <div className="flex ml-1 items-center mt-2">
              <div className="text-green mr-3 text-xl">+</div>
              <div className="flex gap-3 justify-center items-center text-white">
                {action === "stake" ? <XStepLogo /> : <Step />}
                <div className="text-lightGray">{receiveAmount.toFixed(9)}</div>
                {action === "stake" ? "xSTEP" : "STEP"}
              </div>
            </div>
            {signature && (
              <div className="ml-28 mt-2 text-xs flex border-solid p-1 border rounded-sm border-gray gap-2 justify-center items-center text-green">
                <a
                  className=""
                  href={`https://solscan.io/tx/${signature}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  View on Solscan
                </a>
                <ExternalLinkIcon />
              </div>
            )}
          </div>
        </div>
      );
  }
};
