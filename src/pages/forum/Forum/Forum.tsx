import './forum.css';
import b_ from 'b_';
import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { forumActions } from '../reducer';
import { FormExtendedEvent } from 'grommet';
import { getForumTopics } from '../selectors';
import { random } from '../../game/lib/utils';
import { CreateTopicFormFields } from '../types';
import { useAction, useAuth } from '@common/hooks';
import { Container } from '@components/Container/Container';
import { ForumHead } from '../Components/ForumHeader/ForumHead';
import { ForumTopicsList } from '../Components/TopicsList/ForumTopicsList';
import { ForumCreateTopicModal } from '../Components/CreateTopicModal/ForumCreateTopicModal';

const block = b_.lock('forum');

const createTopicFormInitValue: CreateTopicFormFields = {
  topicName: '',
};

export const Forum: FC = () => {
  useAuth();

  const topics = useSelector(getForumTopics);

  const addTopic = useAction(forumActions.addTopic);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const onTopicCreateClick = () => setIsModalOpen(true);
  const onCreateTopicModalClose = () => setIsModalOpen(false);

  const [isFormLoading, setIsFormLoading] = useState(false);

  const [formFields, setFormFields] = useState<CreateTopicFormFields>(createTopicFormInitValue);
  const onCreateTopicFormChange = (value: CreateTopicFormFields) => setFormFields(value);
  const onCreateTopicFormSubmit = ({ value }: FormExtendedEvent<CreateTopicFormFields>) => {
    // TODO: запрос в апи
    console.log(value);
    setIsFormLoading(true);

    setTimeout(() => {
      addTopic({
        id: random(10000),
        name: value.topicName,
        createTimestamp: Date.now(),
        messages: [],
      });
      setIsFormLoading(false);
      setIsModalOpen(false);
      setFormFields(createTopicFormInitValue);
    }, 1000);
  };

  return (
    <Container className={block()}>
      <ForumHead onTopicCreateClick={onTopicCreateClick} />

      <div className={block('topics-wrap')}>
        <ForumTopicsList topics={topics} />
      </div>

      {isModalOpen &&
        <ForumCreateTopicModal
          formValue={formFields}
          onClose={onCreateTopicModalClose}
          onChange={onCreateTopicFormChange}
          onSubmit={onCreateTopicFormSubmit}
          isLoading={isFormLoading}
        />
      }
    </Container>
  );
};
