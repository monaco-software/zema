import './leaderboard-table-placeholder.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@common/constants';
import { getText } from '@common/langUtils';

const block = b_.lock('leaderboard-table-placeholder');

export const LeaderboardTablePlaceholder: FC = () => {
  return (
    <div className={block()}>
      <p className={block('message')}>
        {getText('leaderboard_table_placeholder_message')}
      </p>

      <Link to={ROUTES.GAME}>
        {getText('leaderboard_table_placeholder_cta')}
      </Link>
    </div>
  );
};
