import { prisma } from '../server';
import { ParamsWithUserId } from './types';
import { ForumTopic, ForumTopicMessage } from '@prisma/client';
import {
  CreateForumMessageParams,
  CreateForumTopicParams,
  GetForumMessagesParams,
} from '@api/schema';

export const ForumModel = {
  async getTopics(): Promise<ForumTopic[]> {
    return await prisma.forumTopic.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async createTopic({
    userId,
    title,
  }: ParamsWithUserId<CreateForumTopicParams>): Promise<ForumTopic> {
    return await prisma.forumTopic.create({
      data: {
        title,
        userId,
      },
    });
  },

  async getMessages({
    topicId,
  }: GetForumMessagesParams): Promise<ForumTopicMessage[]> {
    return await prisma.forumTopicMessage.findMany({
      where: { topicId: topicId },
    });
  },

  async createMessage({
    text,
    topicId,
    userId,
  }: ParamsWithUserId<CreateForumMessageParams>): Promise<ForumTopicMessage> {
    return await prisma.forumTopicMessage.create({
      data: {
        text,
        topicId,
        userId,
      },
    });
  },
};
