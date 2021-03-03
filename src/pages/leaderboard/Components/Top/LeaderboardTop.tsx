import './leaderboard-top.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { Box } from 'grommet';
import { LeaderboardRecord } from '../../types';
import { getUserFullName } from '@common/helpers';
import { AvatarWithFallback } from '@components/AvatarWithFallback/AvatarWithFallback';

const block = b_.lock('leaderboard-top');

interface LeaderboardTopUserProps {
  place: number;
  record: LeaderboardRecord;
  isCurrentUser: boolean;
}

const LeaderboardTopUser: FC<LeaderboardTopUserProps> = ({ place, record, isCurrentUser }) => {
  const name = getUserFullName(record);

  const points = record.points.toLocaleString();

  return (
    <Box className={block('user', { 'current': isCurrentUser })} justify="center" align="center">
      <span className={block('user-place')}>{place}</span>

      <AvatarWithFallback
        className={block('user-avatar')}
        url={record.avatar}
        size={64}
      />

      <div className={block('user-name')} title={name}>{name}</div>

      <div className={block('user-points')} title={points}>{points}</div>
    </Box>
  );
};

interface Props {
  records: LeaderboardRecord[];
  currentUserId: number;
}

export const LeaderboardTop: FC<Props> = ({ records, currentUserId }) => {
  return (
    <div className={block()}>
      {records.map((record, index) => {
        const isCurrentUser = record.id === currentUserId;
        const place = index + 1;

        return (
          <LeaderboardTopUser
            key={record.id}
            place={place}
            record={record}
            isCurrentUser={isCurrentUser}
          />
        );
      })}
    </div>
  );
};
