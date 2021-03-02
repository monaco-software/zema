import { RootState } from '@store/store';
import { DEFAULT_TOPIC_ID } from './constants';
import { createSelector } from '@reduxjs/toolkit';

const getForumState = (state: RootState) => state.forum;

export const getForumTopics = createSelector(
  getForumState,
  (state) => state.topics,
);

export const getForumTopicById = (topicId: number) => createSelector(
  getForumTopics,
  (topics) => {
    const topic = topics.find((topic) => topic.id === topicId);
    const defaultValue = {
      id: DEFAULT_TOPIC_ID,
      name: '',
      createTimestamp: 0,
      messages: [],
    };

    return topic ?? defaultValue;
  },
);
