import { ForumState } from './types';
import { ForumTopicMessage } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ForumState = {
  topics: [],
  messages: {},
};

interface SetMessagesPayload {
  topicId: number;
  messages: ForumTopicMessage[];
}

interface AddMessagePayload {
  topicId: number;
  message: ForumTopicMessage;
}

const forum = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    setTopics(state, { payload }: PayloadAction<ForumState['topics']>) {
      state.topics = payload;
    },
    addTopic(state, { payload }: PayloadAction<ForumState['topics'][number]>) {
      state.topics.unshift(payload);
    },
    setMessages(state, { payload }: PayloadAction<SetMessagesPayload>) {
      state.messages[payload.topicId] = payload.messages;
    },
    addMessage(state, { payload }: PayloadAction<AddMessagePayload>) {
      const { topicId, message } = payload;

      const topicMessages = state.messages[topicId];
      if (topicMessages) {
        state.messages[topicId].push(message);
      } else {
        state.messages[topicId] = [message];
      }
    },
  },
});

export const forumActions = forum.actions;
export const forumReducer = forum.reducer;
