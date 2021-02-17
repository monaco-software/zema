import './forum.css';
import React, { FC, useState } from 'react';
import b_ from 'b_';
import { useAuth } from '../../hooks';
import { ForumHead } from './Components/ForumHeader/ForumHead';
import { ForumCreateTopicModal } from './Components/CreateTopicModal/ForumCreateTopicModal';
import { CreateTopicFormFields } from './types';
import { FormExtendedEvent } from 'grommet';

const block = b_.lock('forum');

const createTopicFormInitialValue: CreateTopicFormFields = {
  topic_name: '',
};

export const Forum: FC = () => {
  useAuth();

  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  const onTopicCreateClick = () => setIsCreateTopicModalOpen(true);
  const onCreateTopicModalClose = () => setIsCreateTopicModalOpen(false);

  const [isCreateTopicFormLoading, setIsCreateTopicFormLoading] = useState(false);

  const [createTopicFormFields, setCreateTopicFormFields] = useState<CreateTopicFormFields>(createTopicFormInitialValue);
  const onCreateTopicFormChange = (value: CreateTopicFormFields) => setCreateTopicFormFields(value);
  const onCreateTopicFormSubmit = ({ value }: FormExtendedEvent<CreateTopicFormFields>) => {
    // TODO: запрос в апи
    console.log(value);
    setIsCreateTopicFormLoading(true);

    setTimeout(() => {
      setIsCreateTopicFormLoading(false);
      setIsCreateTopicModalOpen(false);
      setCreateTopicFormFields(createTopicFormInitialValue);
    }, 1000);
  };

  return (
    <div className={block()}>
      <ForumHead onTopicCreateClick={onTopicCreateClick} />

      {isCreateTopicModalOpen &&
        <ForumCreateTopicModal
          formValue={createTopicFormFields}
          onClose={onCreateTopicModalClose}
          onChange={onCreateTopicFormChange}
          onSubmit={onCreateTopicFormSubmit}
          isLoading={isCreateTopicFormLoading}
        />
      }
    </div>
  );
};
