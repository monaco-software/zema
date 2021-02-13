import './leaderboard-top.css';
import React, { FC } from 'react';
import { Avatar, Box } from 'grommet';
import b_ from 'b_';
import { User } from 'grommet-icons';
import { UserObjectWithPoints } from '../../types';

const block = b_.lock('leaderboard-top');

interface LeaderboardTopUserProps {
  place: number;
  user: UserObjectWithPoints;
  isCurrentUser: boolean;
}

const LeaderboardTopUser: FC<LeaderboardTopUserProps> = ({ place, user, isCurrentUser }) => {
  const name = user.display_name ?? `${user.first_name} ${user.second_name}`;

  const points = user.points.toLocaleString();

  return (
    <Box className={block('user', { 'current': isCurrentUser })} justify="center" align="center">
      <span className={block('user-place')}>{place}</span>

      {user.avatar &&
        <Avatar className={block('user-avatar')} src={user.avatar} size="64px" />
      }
      {!user.avatar &&
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
  users: UserObjectWithPoints[];
  currentUserId: number;
}

export const LeaderboardTop: FC<Props> = ({ users, currentUserId }) => {
  return (
    <div className={block()}>
      {users.map((user, index) => {
        const isCurrentUser = user.id === currentUserId;
        const place = index + 1;

        return (
          <LeaderboardTopUser
            key={user.id}
            place={place}
            user={user}
            isCurrentUser={isCurrentUser}
          />
        );
      })}
    </div>
  );
};
