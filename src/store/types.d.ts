import { AppState } from '@common/types';
import { Game } from '@pages/game/types';
import { ForumState } from '@pages/forum/types';
import { GameLevels } from '@pages/gameLevels/reducer';
import { LeaderboardState } from '@pages/leaderboard/types';
import { CombinedState, DeepPartial } from '@reduxjs/toolkit';

export type PreloadedState =
  DeepPartial<CombinedState<{
    app: AppState;
    game: Game;
    leaderboard: LeaderboardState;
    gameLevels: GameLevels;
    forum: ForumState;
  }>>
  | undefined;
