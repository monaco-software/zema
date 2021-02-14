import './leaderboard-top.css';
import React, { FC } from 'react';
import { Avatar, Box } from 'grommet';
import b_ from 'b_';
import { User } from 'grommet-icons';
import { LeaderboardRecord } from '../../types';

const block = b_.lock('leaderboard-top');

interface LeaderboardTopUserProps {
  place: number;
  record: LeaderboardRecord;
  isCurrentUser: boolean;
}

const LeaderboardTopUser: FC<LeaderboardTopUserProps> = ({ place, record, isCurrentUser }) => {
  const name = record.display_name ?? `${record.first_name} ${record.second_name}`;

  const points = record.points.toLocaleString();

  return (
    <Box className={block('user', { 'current': isCurrentUser })} justify="center" align="center">
      <span className={block('user-place')}>{place}</span>

      {record.avatar &&
        <Avatar className={block('user-avatar')} src={record.avatar} size="64px" />
      }
      {!record.avatar &&
        <Avatar className={block('user-avatar')} size="64px">
          <User color="light-1" size="24" />
        </Avatar>
      }

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
