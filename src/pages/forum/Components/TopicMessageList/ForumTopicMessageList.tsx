import './forum-topic-message-list.css';
import React, { FC } from 'react';
import { Box, Grid } from 'grommet';
import b_ from 'b_';
import { TopicMessage } from '../../types';
import { AvatarWithFallback } from '../../../../components/AvatarWithFallback/AvatarWithFallback';
import { getUserFullName } from '../../../../common/helpers';
import { MarkdownSafe } from '../../../../components/MarkdownSafe/MarkdownSafe';

const block = b_.lock('forum-topic-message-list');

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

interface MessageProps {
  message: TopicMessage;
  isCurrentUser: boolean;
}

const Message: FC<MessageProps> = ({ message, isCurrentUser }) => {
  const userName = getUserFullName(message.user);
  const date = dateFormatter.format(message.createTimestamp);

  return (
    <Box className={block('message', { 'current-user': isCurrentUser })}>
      <Box className={block('message-author')} direction="row" align="center">
        <AvatarWithFallback url={message.user.avatar} size={36} />

        <Box direction="row" align="center">
          <div className={block('message-author-name')}>
            {userName}
          </div>

          <div className={block('message-date')}>
            {date}
          </div>
        </Box>
      </Box>

      <div className={block('message-text')}>
        <MarkdownSafe>
          {message.text}
        </MarkdownSafe>
      </div>
    </Box>
  );
};

interface Props {
  messages: TopicMessage[];
  currentUserId: number;
}

export const ForumTopicMessageList: FC<Props> = ({ messages, currentUserId }) => {
  return (
    <Grid className={block()} gap="20px">
      {messages.map((message) => {
        const isCurrentUser = message.user.id === currentUserId;

        return (
          <Message
            key={message.id}
            message={message}
            isCurrentUser={isCurrentUser}
          />
        );
      })}
    </Grid>
  );
};

