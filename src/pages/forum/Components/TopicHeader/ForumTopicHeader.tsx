import './forum-topic-header.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { Edit } from 'grommet-icons';
import { getText } from '@common/langUtils';
import { Box, Button, Heading } from 'grommet';

const block = b_.lock('forum-topic-header');

interface Props {
  topicName: string;
  onMessageAddClick: (parentId?: number) => void;
}

export const ForumTopicHeader: FC<Props> = ({
  topicName,
  onMessageAddClick,
}) => {
  const openModal = () => onMessageAddClick();

  return (
    <Box className={block()} direction="row" justify="between" align="start">
      <Heading className={block('name')} level={4} margin="none" fill>
        {topicName}
      </Heading>

      <Button
        className={block('send-message-button')}
        icon={<Edit size="16px" />}
        primary
        size="small"
        margin={{ left: 'medium' }}
        label={getText('forum_topic_send_message_button')}
        onClick={openModal}
      />
    </Box>
  );
};
