import './leaderboard-table-placeholder.css';
import React, { FC } from 'react';
import b_ from 'b_';
import { Link } from 'react-router-dom';
import { getText } from '@common/langUtils';
import { ROUTES } from '@common/constants';

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
