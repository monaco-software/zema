import { RootState } from '@store/store';
import { createSelector } from '@reduxjs/toolkit';
import { ForumMessagesTree } from '@pages/forum/types';
import { DEFAULT_TOPIC_ID } from '@pages/forum/constants';
import { ForumTopic, ForumTopicMessage } from '@prisma/client';

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

const getTrees = (
  messages: ForumTopicMessage[],
  allMessages: ForumTopicMessage[]
): ForumMessagesTree[] => {
  return messages.map((message) => {
    const children = allMessages.filter((item) => item.parentId === message.id);
    return {
      ...message,
      children: children.length ? getTrees(children, allMessages) : undefined,
    };
  });
};

export const getForumTopicMessageTrees = (topicId: number) =>
  createSelector(
    getForumTopicMessages(topicId),
    (messages): ForumMessagesTree[] => {
      return getTrees(messages, messages).filter(
        (item) => item.parentId === null
      );
    }
  );
