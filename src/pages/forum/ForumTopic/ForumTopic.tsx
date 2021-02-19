import './forum-topic.css';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import b_ from 'b_';
import { RouteParams, ROUTES } from '../../../common/constants';
import { useAction, useAuth } from '../../../hooks';
import { useSelector } from 'react-redux';
import { getForumTopicById } from '../selectors';
import { ForumTopicMessageInputModal } from '../Components/MessageInputModal/ForumTopicMessageInputModal';
import { ForumTopicHeader } from '../Components/TopicHeader/ForumTopicHeader';
import { forumActions } from '../reducer';
import { getCurrentUser } from '../../../store/selectors';
import { random } from '../../game/lib/utils';

const block = b_.lock('forum-topic');

export const ForumTopic: FC = () => {
  useAuth();

  const history = useHistory();
  const { topicId } = useParams<RouteParams>();

  const addMessage = useAction(forumActions.addMessage);

  const currentUser = useSelector(getCurrentUser);

  const topic = useSelector(getForumTopicById(Number(topicId)));
  const topicName = topic?.name ?? '';
  const topicIdNumber = topic?.id ?? -1;

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
      addMessage({ topicId: topicIdNumber, message });
      setShowInputModal(false);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (!topic) {
      history.replace(ROUTES.FORUM);
    }
  }, [topic]);

  return (
    <div className={block()}>
      <ForumTopicHeader
        topicName={topicName}
        onMessageAddClick={onModalOpen}
      />

      {showInputModal &&
        <ForumTopicMessageInputModal
          value={messageText}
          isLoading={isLoading}
          onChange={onMessageTextChange}
          onSend={onMessageSend}
          onClose={onModalClose}
        />
      }
    </div>
  );
};

