import React, { FC } from 'react';

interface Props {
  size?: number;
}

export const IconYandex: FC<Props> = ({ size = 32 }) => {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M511 479c0 17-15 32-32 32H33c-17 0-32-15-32-32V33C1 16 16 1 33 1h446c17 0 32 15 32 32v446z"
        fill="#ED1F24"
      />
      <path
        d="M313 105h-45c-45 0-83 35-83 101 0 40 18 69 51 83l-61 111c-2 4 0 7
        3 7h29c2 0 4-1 4-3l56-109h20v109c0 1 1 3 3 3h25c2 0 3-2 3-4V109c0-2-2-4-5-4zm-26
        164h-17c-26 0-52-19-52-67 0-50 24-71 49-71h20v138z"
        fill="#FFF"
      />
    </svg>
  );
};
