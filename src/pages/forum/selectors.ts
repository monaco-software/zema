import { RootState } from '../../store/store';
import { createSelector } from '@reduxjs/toolkit';

const getForumState = (state: RootState) => state.forum;

export const getForumTopics = createSelector(
  getForumState,
  (state) => state.topics,
);

export const getForumTopicById = (topicId: number) => createSelector(
  getForumTopics,
  (topics) => {
    const topicIdNumber = Number(topicId);

    return topics.find((topic) => topic.id === topicIdNumber);
  },
);
