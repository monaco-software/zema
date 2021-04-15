import './leaderboard.css';
import b_ from 'b_';
import React, { FC, useEffect, useState } from 'react';
import { Box, Heading } from 'grommet';
import { useSelector } from 'react-redux';
import { getText } from '@common/langUtils';
import { TOP_USERS_COUNT } from './constants';
import { getCurrentUser } from '@store/selectors';
import { getLeaderboardRecords } from './selectors';
import { Spinner } from '@components/Spinner/Spinner';
import { useAsyncAction, useAuth } from '@common/hooks';
import { asyncLeaderboardActions } from './asyncActions';
import { Container } from '@components/Container/Container';
import { LeaderboardTop } from './Components/Top/LeaderboardTop';
import { LeaderboardTable } from './Components/Table/LeaderboardTable';
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
    getLeaderboard({ cursor: 0, limit: 100 }).finally(() =>
      setIsLoading(false)
    );
  }, []);

  return (
    <Container className={block()}>
      <Heading textAlign="center" level="2">
        {getText('leaderboard_page_header')}
      </Heading>

      {isLoading && (
        <Box align="center">
          <Spinner />
        </Box>
      )}

      {!isLoading && (
        <>
          {needTopUsers && (
            <LeaderboardTop records={topUsers} currentUserId={currentUser.id} />
          )}

          {needTable && (
            <div className={block('table-wrap')}>
              <LeaderboardTable
                records={tableUsers}
                currentUserId={currentUser.id}
                startPlace={tableStartPlace}
              />
            </div>
          )}

          {!needTable && <LeaderboardTablePlaceholder />}
        </>
      )}
    </Container>
  );
};
