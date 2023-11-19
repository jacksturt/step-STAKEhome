import { FC, SVGAttributes } from "react";

export interface ExternalLinkIconProps extends SVGAttributes<SVGSVGElement> {}

const ExternalLinkIcon: FC<ExternalLinkIconProps> = ({
  ...componentProps
}: ExternalLinkIconProps) => (
  <svg
    width="12"
    height="12"
    {...componentProps}
    viewBox="0 0 14 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.5 9C10.9648 9 11.375 9.41016 11.375 9.875V12.5C11.375 13.4844 10.582 14.25 9.625 14.25H1.75C0.765625 14.25 0 13.4844 0 12.5V4.625C0 3.66797 0.765625 2.875 1.75 2.875H4.375C4.83984 2.875 5.25 3.28516 5.25 3.75C5.25 4.24219 4.83984 4.625 4.375 4.625H1.75V12.5H9.625V9.875C9.625 9.41016 10.0078 9 10.5 9ZM13.3438 0.25C13.6992 0.25 14 0.550781 14 0.90625V4.625C14 4.98047 13.7812 5.30859 13.4531 5.44531C13.125 5.58203 12.7422 5.5 12.4961 5.25391L11.375 4.13281L5.85156 9.62891C5.6875 9.79297 5.46875 9.875 5.25 9.875C5.00391 9.875 4.78516 9.79297 4.62109 9.62891C4.26562 9.30078 4.26562 8.72656 4.62109 8.39844L10.1172 2.875L8.99609 1.75391C8.75 1.50781 8.66797 1.125 8.80469 0.796875C8.94141 0.46875 9.26953 0.25 9.625 0.25H13.3438Z"
      fill="#B2B2B2"
    />
  </svg>
);

export default ExternalLinkIcon;