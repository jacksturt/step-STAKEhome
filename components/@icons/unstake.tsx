import React from "react";

const Unstake = ({ enabled }: { enabled?: boolean }) => {
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 14.9998C0 14.7346 0.105357 14.4802 0.292893 14.2927C0.48043 14.1051 0.734784 13.9998 1 13.9998H13C13.2652 13.9998 13.5196 14.1051 13.7071 14.2927C13.8946 14.4802 14 14.7346 14 14.9998C14 15.265 13.8946 15.5194 13.7071 15.7069C13.5196 15.8944 13.2652 15.9998 13 15.9998H1C0.734784 15.9998 0.48043 15.8944 0.292893 15.7069C0.105357 15.5194 0 15.265 0 14.9998ZM3.293 4.70679C3.10553 4.51926 3.00021 4.26495 3.00021 3.99979C3.00021 3.73462 3.10553 3.48031 3.293 3.29279L6.293 0.292786C6.48053 0.105315 6.73484 0 7 0C7.26516 0 7.51947 0.105315 7.707 0.292786L10.707 3.29279C10.8892 3.48139 10.99 3.73399 10.9877 3.99619C10.9854 4.25838 10.8802 4.5092 10.6948 4.6946C10.5094 4.88001 10.2586 4.98518 9.9964 4.98746C9.7342 4.98974 9.4816 4.88894 9.293 4.70679L8 3.41379V10.9998C8 11.265 7.89464 11.5194 7.70711 11.7069C7.51957 11.8944 7.26522 11.9998 7 11.9998C6.73478 11.9998 6.48043 11.8944 6.29289 11.7069C6.10536 11.5194 6 11.265 6 10.9998V3.41379L4.707 4.70679C4.51947 4.89426 4.26516 4.99957 4 4.99957C3.73484 4.99957 3.48053 4.89426 3.293 4.70679Z"
        fill={enabled ? "#00f8b7" : "#B2B2B2"}
      ></path>
    </svg>
  );
};

export default Unstake;
