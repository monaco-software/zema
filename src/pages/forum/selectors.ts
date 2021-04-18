import { RootState } from '@store/store';
import { ForumTopic, ForumTopicMessage } from '@prisma/client';
import { createSelector } from '@reduxjs/toolkit';
import { DEFAULT_TOPIC_ID } from '@pages/forum/constants';
import { ForumMessagesTree } from '@pages/forum/types';

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
  const messageTrees: ForumMessagesTree[] = [];

  messages.forEach((message) => {
    const children = allMessages.filter((item) => item.parentId === message.id);
    const tree: ForumMessagesTree = {
      ...message,
      children: children.length ? getTrees(children, allMessages) : undefined,
    };

    messageTrees.push(tree);
  });

  return messageTrees;
};

export const getForumTopicMessageTrees = (topicId: number) =>
  createSelector(
    getForumTopicMessages(topicId),
    (messages): ForumMessagesTree[] => {
      const messageTrees = getTrees(messages, messages);
      return messageTrees.filter((item) => item.parentId === null);
    }
  );
