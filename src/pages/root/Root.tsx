import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '@common/hooks';
import { ROUTES } from '@common/constants';

export const Root: FC = ({}) => {
  useAuth();

  return (
    <Redirect to={ROUTES.GAME_LEVELS} />
  );
};

