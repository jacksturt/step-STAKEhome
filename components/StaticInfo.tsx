import StakeUnstake from "./@icons/stakeUnstake";
import XStepLogo from "./@icons/xstep";

export const StaticInfo = () => {
  return (
    <>
      <div className="flex mt-2 mb-8">
        <StakeUnstake />
        <div className="ml-4 text-xl">Stake Step</div>
      </div>
      <div className="text-gray text-sm">Stake STEP to receive xSTEP</div>
      <div className="w-[390px] mt-10 p-7 text-sm bg-shadow rounded-lg mb-4">
        <div className="flex items-center  mb-7">
          <XStepLogo />
          <div className="ml-2 mr-auto">xSTEP staking APY</div>
          <div className="font-number">14.41%</div>
        </div>
        <div className="mb-2">"Where is my staking reward?"</div>
        <div className="text-gray">
          xSTEP is a yield bearing asset. This means it is automatically worth
          more STEP over time. You don't need to claim any rewards, or do
          anything other than hold your xSTEP to benefit from this. Later, when
          you unstake your xSTEP you will receive more STEP than you initially
          deposited.
        </div>
      </div>
    </>
  );
};
