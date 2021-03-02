import React, { FC } from 'react';
import { useAuth } from '@common/hooks';
import { ROUTES } from '@common/constants';
import { Redirect } from 'react-router-dom';

export const Root: FC = ({}) => {
  useAuth();

  return (
    <Redirect to={ROUTES.GAME_LEVELS} />
  );
};

