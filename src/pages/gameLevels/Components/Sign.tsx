import React, { FC } from 'react';
import { Lock, Star } from 'grommet-icons';

interface SignProps {
  isAllowed: boolean;
}

export const Sign: FC<SignProps> = ({ isAllowed }) => {
  if (isAllowed) {
    return <Star color="accent-4" />;
  }
  return <Lock color="dark-4" />;
};
