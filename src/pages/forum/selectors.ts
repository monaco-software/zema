import { RootState } from '../../store/store';
import { createSelector } from '@reduxjs/toolkit';

const getForumState = (state: RootState) => state.forum;

export const getForumTopics = createSelector(
  getForumState,
  (state) => state.topics,
);
