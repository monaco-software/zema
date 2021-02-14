import './leaderboard-table.css';
import React, { FC } from 'react';
import b_ from 'b_';
import { LeaderboardRecord } from '../../types';
import { Avatar } from 'grommet';
import { User } from 'grommet-icons';

const block = b_.lock('leaderboard-table');

interface LeaderboardTableRowProps {
  record: LeaderboardRecord;
  place: number;
  isCurrentUser: boolean;
}

const LeaderboardTableRow: FC<LeaderboardTableRowProps> = ({ record, place, isCurrentUser }) => {
  const name = record.display_name ?? `${record.first_name} ${record.second_name}`;
  const points = record.points.toLocaleString();

  return (
    <tr className={block('row')}>
      <td className={block('cell', { 'type': 'place', 'current-user': isCurrentUser })}>
        {place}
      </td>

      <td className={block('cell', { 'type': 'name', 'current-user': isCurrentUser })}>
        {record.avatar &&
          <Avatar className={block('user-avatar')} src={record.avatar} size="32px" />
        }
        {!record.avatar &&
          <Avatar className={block('user-avatar')} size="32px">
            <User color="light-1" size="16" />
          </Avatar>
        }
        {name}
      </td>

      <td className={block('cell', { 'type': 'points', 'current-user': isCurrentUser })}>
        {points}
      </td>
    </tr>
  );
};

interface Props {
  records: LeaderboardRecord[];
  currentUserId: number;
  startPlace: number;
}

export const LeaderboardTable: FC<Props> = ({ records, currentUserId, startPlace }) => {
  return (
    <table className={block()}>
      <tbody>
        {records.map((record, index) => {
          const place = startPlace + index + 1;
          const isCurrentUser = record.id === currentUserId;

          return (
            <LeaderboardTableRow
              key={record.id}
              record={record}
              place={place}
              isCurrentUser={isCurrentUser}
            />
          );
        })}
      </tbody>
    </table>
  );
};
