import './forum-topic.css';
import b_ from 'b_';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Box } from 'grommet';
import { useSelector } from 'react-redux';
import { DEFAULT_TOPIC_ID } from '../constants';
import { Spinner } from '@components/Spinner/Spinner';
import { useAsyncAction, useAuth } from '@common/hooks';
import { RouteParams, ROUTES } from '@common/constants';
import { useHistory, useParams } from 'react-router-dom';
import { getCurrentUser, getUsers } from '@store/selectors';
import { Container } from '@components/Container/Container';
import { asyncForumActions } from '@pages/forum/asyncActions';
import { getForumTopicById, getForumTopicMessageTrees } from '../selectors';
import { ForumTopicHeader } from '../Components/TopicHeader/ForumTopicHeader';
import { ForumTopicMessageModal } from '../Components/MessageModal/ForumTopicMessageModal';
import { ForumTopicMessageList } from '../Components/TopicMessageList/ForumTopicMessageList';

const block = b_.lock('forum-topic');

export const ForumTopic: FC = () => {
  useAuth();

  const history = useHistory();
  const { topicId: topicIdFromRoute } = useParams<RouteParams>();
  const topicId = Number(topicIdFromRoute);

  const getMessages = useAsyncAction(asyncForumActions.getMessages);
  const createMessage = useAsyncAction(asyncForumActions.createMessage);

  const currentUser = useSelector(getCurrentUser);

  const { title: topicName } = useSelector(getForumTopicById(topicId));
  const messageTrees = useSelector(getForumTopicMessageTrees(topicId));

  const users = useSelector(getUsers);

  const [isModalLoading, setIsModalLoading] = useState(false);

  const [showInputModal, setShowInputModal] = useState(false);
  const onModalOpen = () => setShowInputModal(true);
  const onModalClose = () => setShowInputModal(false);

  const [messageText, setMessageText] = useState('');
  const onMessageTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(event.target.value);
  };

  const onMessageSend = () => {
    const clearedInputText = messageText.trim();
    if (!clearedInputText) {
      return;
    }

    setIsModalLoading(true);

    createMessage({ topicId, text: clearedInputText })
      .then(() => {
        setMessageText('');
        setShowInputModal(false);
      })
      .finally(() => {
        setIsModalLoading(false);
      });
  };

  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  useEffect(() => {
    if (topicId === DEFAULT_TOPIC_ID) {
      history.replace(ROUTES.FORUM);
      return;
    }

    if (messageTrees.length) {
      return;
    }

    setIsMessagesLoading(true);
    getMessages({ topicId }).finally(() => setIsMessagesLoading(false));
  }, [topicId]);

  return (
    <Container className={block()}>
      <ForumTopicHeader topicName={topicName} onMessageAddClick={onModalOpen} />

      <div className={block('messages-list-wrap')}>
        {isMessagesLoading && (
          <Box justify="center" direction="row" fill="horizontal">
            <Spinner />
          </Box>
        )}
        {!isMessagesLoading && (
          <ForumTopicMessageList
            messages={messageTrees}
            users={users}
            currentUserId={currentUser.id}
          />
        )}
      </div>

      {showInputModal && (
        <ForumTopicMessageModal
          value={messageText}
          isLoading={isModalLoading}
          onChange={onMessageTextChange}
          onSend={onMessageSend}
          onClose={onModalClose}
        />
      )}
    </Container>
  );
};
