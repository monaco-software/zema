import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ForumState, TopicMessage } from './types';
import { UserObject } from '@api/schema';

// TODO: удалить, когда появится АПИ
const userMock: UserObject = {
  id: 0,
  first_name: 'Test',
  second_name: 'Bot',
  display_name: null,
  email: '',
  login: '',
  phone: '',
  avatar: null,
};

const messagesMock: TopicMessage[] = [
  { id: 0, text: 'Привет, как дела?', user: userMock, createTimestamp: Date.now() },
  // eslint-disable-next-line max-len
  { id: 1, text: '* во-первых, я в другом городе\n* во-вторых, что ты мне сделаешь\n* в-третьих, я в другом городе', user: userMock, createTimestamp: Date.now() },
  // eslint-disable-next-line max-len
  { id: 2, text: '### Отзыв по игре:\n\n **Она прекрасна! 😍**  \nХочу еще уровней', user: userMock, createTimestamp: Date.now() },
];

const topicsMock: ForumState['topics'] = [
  { id: 0, name: 'Тема №1', createTimestamp: Date.now(), messages: [messagesMock[0]] },
  { id: 1, name: 'Тема №2', createTimestamp: Date.now(), messages: [messagesMock[0]] },
  {
    id: 2,
    name: '🔥 Это название темы с очень очень очень очень очень очень длинным названием',
    createTimestamp: Date.now(),
    messages: messagesMock,
  },
];

const initialState: ForumState = {
  topics: topicsMock,
};

interface AddMessagePayload {
  topicId: number;
  message: TopicMessage;
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
    addMessage(state, { payload }: PayloadAction<AddMessagePayload>) {
      const topic = state.topics.find((item) => item.id === payload.topicId);
      if (!topic) {
        return;
      }

      topic.messages.push(payload.message);
    },
  },
});

export const forumActions = forum.actions;
export const forumReducer = forum.reducer;
