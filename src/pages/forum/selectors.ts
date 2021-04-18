import { RootState } from '@store/store';
import { ForumTopic } from '@prisma/client';
import { createSelector } from '@reduxjs/toolkit';
import { DEFAULT_TOPIC_ID } from '@pages/forum/constants';

const getForumState = (state: RootState) => state.forum;

export const getForumTopics = createSelector(
  getForumState,
  (state) => state.topics
);

export const getForumTopicById = (topicId: number) =>
  createSelector(getForumTopics, (topics) => {
    const topic = topics.find((topic) => topic.id === topicId);
    const defaultValue: ForumTopic = {
      id: DEFAULT_TOPIC_ID,
      userId: -1,
      title: '',
      createdAt: new Date(),
    };

    return topic ?? defaultValue;
  });

export const getForumTopicMessages = (topicId: number) =>
  createSelector(getForumState, (state) => state.messages[topicId] ?? []);
