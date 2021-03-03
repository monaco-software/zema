import './leaderboard-table.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { LeaderboardRecord } from '../../types';
import { getUserFullName } from '@common/helpers';
import { AvatarWithFallback } from '@components/AvatarWithFallback/AvatarWithFallback';

const block = b_.lock('leaderboard-table');

interface LeaderboardTableRowProps {
  record: LeaderboardRecord;
  place: number;
  isCurrentUser: boolean;
}

const LeaderboardTableRow: FC<LeaderboardTableRowProps> = ({ record, place, isCurrentUser }) => {
  const name = getUserFullName(record);
  const points = record.points.toLocaleString();

  return (
    <tr className={block('row', { 'current-user': isCurrentUser })}>
      <td className={block('cell', { 'type': 'place' })}>
        {place}
      </td>

      <td className={block('cell', { 'type': 'name' })}>
        <AvatarWithFallback
          className={block('user-avatar')}
          url={record.avatar}
          size={32}
        />
        {name}
      </td>

      <td className={block('cell', { 'type': 'points' })}>
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
