import { AppThunk } from '@store/store';
import { getUsers } from '@store/selectors';
import { appActions } from '@store/reducer';
import { forumActions } from '@pages/forum/reducer';
import { CreateForumMessageParams, UserObject } from '@api/schema';
import { getDeletedUser, getUserWithFullAvatarUrl } from '@common/helpers';
import {
  apiCreateForumMessage,
  apiCreateForumTopic,
  apiGetForumTopicMessages,
  apiGetForumTopics,
  apiGetUserById,
} from '@api/methods';

export const asyncForumActions = {
  getTopics: (): AppThunk<Promise<void>> => async (dispatch) => {
    const response = await dispatch(apiGetForumTopics());
    dispatch(forumActions.setTopics(response));
  },

  createTopic: (params: { title: string }): AppThunk<Promise<void>> => async (
    dispatch
  ) => {
    const response = await dispatch(apiCreateForumTopic(params));
    dispatch(forumActions.addTopic(response));
  },

  getMessages: (params: { topicId: number }): AppThunk<Promise<void>> => async (
    dispatch,
    getState
  ) => {
    const storedUsers = getUsers(getState());

    const response = await dispatch(apiGetForumTopicMessages(params.topicId)());

    const userIdsSet = new Set<number>();
    response.forEach(({ userId }) => {
      if (!storedUsers[userId]) {
        userIdsSet.add(userId);
      }
    });

    const userIds = [...userIdsSet];

    const users = await Promise.all(
      userIds.map(
        async (userId): Promise<UserObject> => {
          try {
            return await dispatch(apiGetUserById(userId)(undefined, false));
          } catch (error) {
            return getDeletedUser(userId);
          }
        }
      )
    );

    const usersWithFullAvatars = users.map(getUserWithFullAvatarUrl);

    dispatch(appActions.setUserMany(usersWithFullAvatars));

    dispatch(
      forumActions.setMessages({
        topicId: params.topicId,
        messages: response,
      })
    );
  },

  createMessage: (
    params: CreateForumMessageParams
  ): AppThunk<Promise<void>> => async (dispatch) => {
    const message = await dispatch(apiCreateForumMessage(params));

    dispatch(forumActions.addMessage({ topicId: params.topicId, message }));
  },
};
