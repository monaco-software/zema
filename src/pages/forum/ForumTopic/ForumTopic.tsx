import './forum-topic.css';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import b_ from 'b_';
import { RouteParams, ROUTES } from '../../../common/constants';
import { useAuth } from '../../../hooks';
import { useSelector } from 'react-redux';
import { getForumTopicById } from '../selectors';
import { ForumTopicMessageInputModal } from '../Components/MessageInputModal/ForumTopicMessageInputModal';
import { Button } from 'grommet';

const block = b_.lock('forum-topic');

export const ForumTopic: FC = () => {
  useAuth();

  const history = useHistory();
  const { topicId } = useParams<RouteParams>();

  const topic = useSelector(getForumTopicById(Number(topicId)));

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
      <Button label="Test" onClick={onModalOpen} />
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

