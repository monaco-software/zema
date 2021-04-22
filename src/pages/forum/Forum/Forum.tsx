import './forum.css';
import b_ from 'b_';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getForumTopics } from '../selectors';
import { Box, FormExtendedEvent } from 'grommet';
import { CreateTopicFormFields } from '../types';
import { Spinner } from '@components/Spinner/Spinner';
import { useAsyncAction, useAuth } from '@common/hooks';
import { Container } from '@components/Container/Container';
import { asyncForumActions } from '@pages/forum/asyncActions';
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

  const getTopics = useAsyncAction(asyncForumActions.getTopics);
  const createForumTopic = useAsyncAction(asyncForumActions.createTopic);

  const [isTopicsLoading, setIsTopicsLoading] = useState(false);

  useEffect(() => {
    if (topics.length !== 0) {
      return;
    }

    setIsTopicsLoading(true);

    getTopics().finally(() => setIsTopicsLoading(false));
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const onTopicCreateClick = () => setIsModalOpen(true);
  const onCreateTopicModalClose = () => setIsModalOpen(false);

  const [isFormLoading, setIsFormLoading] = useState(false);

  const [formFields, setFormFields] = useState<CreateTopicFormFields>(
    createTopicFormInitValue
  );
  const onCreateTopicFormChange = (value: CreateTopicFormFields) =>
    setFormFields(value);
  const onCreateTopicFormSubmit = ({
    value,
  }: FormExtendedEvent<CreateTopicFormFields>) => {
    setIsFormLoading(true);

    createForumTopic({ title: value.topicName })
      .then(() => {
        setIsModalOpen(false);
        setFormFields(createTopicFormInitValue);
      })
      .finally(() => {
        setIsFormLoading(false);
      });
  };

  return (
    <Container className={block()}>
      <ForumHead onTopicCreateClick={onTopicCreateClick} />

      <div className={block('topics-wrap')}>
        {isTopicsLoading && (
          <Box justify="center" direction="row" fill="horizontal">
            <Spinner />
          </Box>
        )}
        {!isTopicsLoading && <ForumTopicsList topics={topics} />}
      </div>

      {isModalOpen && (
        <ForumCreateTopicModal
          formValue={formFields}
          onClose={onCreateTopicModalClose}
          onChange={onCreateTopicFormChange}
          onSubmit={onCreateTopicFormSubmit}
          isLoading={isFormLoading}
        />
      )}
    </Container>
  );
};
