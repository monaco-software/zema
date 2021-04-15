import './forum-topic.css';
import b_ from 'b_';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { forumActions } from '../reducer';
import { random } from '../../game/lib/utils';
import { DEFAULT_TOPIC_ID } from '../constants';
import { getForumTopicById } from '../selectors';
import { getCurrentUser } from '@store/selectors';
import { useAction, useAuth } from '@common/hooks';
import { RouteParams, ROUTES } from '@common/constants';
import { useHistory, useParams } from 'react-router-dom';
import { Container } from '@components/Container/Container';
import { ForumTopicHeader } from '../Components/TopicHeader/ForumTopicHeader';
import { ForumTopicMessageModal } from '../Components/MessageModal/ForumTopicMessageModal';
import { ForumTopicMessageList } from '../Components/TopicMessageList/ForumTopicMessageList';

const block = b_.lock('forum-topic');

export const ForumTopic: FC = () => {
  useAuth();

  const history = useHistory();
  const { topicId: topicIdFromRoute } = useParams<RouteParams>();

  const addMessage = useAction(forumActions.addMessage);

  const currentUser = useSelector(getCurrentUser);

  const { id: topicId, name: topicName, messages: topicMessages } = useSelector(
    getForumTopicById(Number(topicIdFromRoute))
  );

  const [isLoading, setIsLoading] = useState(false);

  const [showInputModal, setShowInputModal] = useState(false);
  const onModalOpen = () => setShowInputModal(true);
  const onModalClose = () => setShowInputModal(false);

  const [messageText, setMessageText] = useState('');
  const onMessageTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(event.target.value);
  };

  const onMessageSend = () => {
    // TODO: запрос в апи
    const clearedInputText = messageText.trim();
    if (!clearedInputText) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setMessageText('');
      const message = {
        id: random(10000),
        text: messageText,
        user: currentUser,
        createTimestamp: Date.now(),
      };
      addMessage({ topicId: topicId, message });
      setShowInputModal(false);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (topicId === DEFAULT_TOPIC_ID) {
      history.replace(ROUTES.FORUM);
    }
  }, [topicId]);

  return (
    <Container className={block()}>
      <ForumTopicHeader topicName={topicName} onMessageAddClick={onModalOpen} />

      <div className={block('messages-list-wrap')}>
        <ForumTopicMessageList
          messages={topicMessages}
          currentUserId={currentUser.id}
        />
      </div>

      {showInputModal && (
        <ForumTopicMessageModal
          value={messageText}
          isLoading={isLoading}
          onChange={onMessageTextChange}
          onSend={onMessageSend}
          onClose={onModalClose}
        />
      )}
    </Container>
  );
};
