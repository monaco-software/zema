import './forum-topic-header.css';
import React, { FC } from 'react';
import b_ from 'b_';
import { Box, Button, Heading } from 'grommet';
import { getText } from '@common/langUtils';
import { Edit } from 'grommet-icons';

const block = b_.lock('forum-topic-header');

interface Props {
  topicName: string;
  onMessageAddClick: VoidFunction;
}

export const ForumTopicHeader: FC<Props> = ({ topicName, onMessageAddClick }) => {
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
        onClick={onMessageAddClick}
      />
    </Box>
  );
};
