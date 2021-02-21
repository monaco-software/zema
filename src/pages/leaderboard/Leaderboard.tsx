import './leaderboard.css';
import React, { FC, useEffect, useState } from 'react';
import b_ from 'b_';
import { useAsyncAction, useAuth } from '../../hooks';
import { LeaderboardTop } from './Components/Top/LeaderboardTop';
import { Box, Heading } from 'grommet';
import { getText } from '../../common/langUtils';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../store/selectors';
import { LeaderboardTable } from './Components/Table/LeaderboardTable';
import { TOP_USERS_COUNT } from './constants';
import { asyncLeaderboardActions } from './asyncActions';
import { getLeaderboardRecords } from './selectors';
import { Spinner } from '../../components/Spinner/Spinner';
import { LeaderboardTablePlaceholder } from './Components/TablePlaceholder/LeaderboardTablePlaceholder';

const block = b_.lock('leaderboard');

export const Leaderboard: FC = () => {
  useAuth();

  const getLeaderboard = useAsyncAction(asyncLeaderboardActions.getLeaderboard);

  const currentUser = useSelector(getCurrentUser);
  const records = useSelector(getLeaderboardRecords);

  const topUsers = records.slice(0, TOP_USERS_COUNT);
  const needTopUsers = topUsers.length === TOP_USERS_COUNT;

  const tableUsers = needTopUsers ? records.slice(TOP_USERS_COUNT) : records;
  const tableStartPlace = needTopUsers ? TOP_USERS_COUNT : 0;
  const needTable = Boolean(tableUsers.length);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: поддержать пагинацию
    getLeaderboard({ cursor: 0, limit: 100 })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className={block()}>
      <Heading textAlign="center" level="2">
        {getText('leaderboard_page_header')}
      </Heading>

      {isLoading &&
        <Box align="center">
          <Spinner />
        </Box>
      }

      {!isLoading &&
        <>
          {needTopUsers &&
            <LeaderboardTop
              records={topUsers}
              currentUserId={currentUser.id}
            />
          }

          {needTable &&
            <div className={block('table-wrap')}>
              <LeaderboardTable
                records={tableUsers}
                currentUserId={currentUser.id}
                startPlace={tableStartPlace}
              />
            </div>
          }

          {!needTable && <LeaderboardTablePlaceholder />}
        </>
      }
    </div>
  );
};
