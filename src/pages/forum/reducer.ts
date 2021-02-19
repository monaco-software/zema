import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ForumState, Topic, TopicMessage } from './types';

// TODO: удалить, когда появится АПИ
const topicsMock: ForumState['topics'] = [
  { id: 0, name: 'Тема №1', createTimestamp: Date.now(), messages: [] },
  { id: 1, name: 'Тема №2', createTimestamp: Date.now(), messages: [] },
  {
    id: 2,
    name: 'Это название темы. Оно очень занимательно, глаз сразу цепляется за нее. Кстати, тема должна быть не более 140 символов в длину. Ну вот ровно',
    createTimestamp: Date.now(),
    messages: [],
  },
];

const initialState: ForumState = {
  topics: topicsMock,
};

const forum = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    setTopics(state, { payload }: PayloadAction<ForumState['topics']>) {
      state.topics = payload;
    },
    addTopic(state, { payload }: PayloadAction<Topic>) {
      state.topics.unshift(payload);
    },
    addMessage(state, { payload }: PayloadAction<{ topicId: number; message: TopicMessage }>) {
      const topicIndex = state.topics.findIndex((item) => item.id === payload.topicId);
      if (topicIndex === -1) {
        return;
      }

      state.topics[topicIndex].messages.push(payload.message);
    },
  },
});

export const forumActions = forum.actions;
export const forumReducer = forum.reducer;
