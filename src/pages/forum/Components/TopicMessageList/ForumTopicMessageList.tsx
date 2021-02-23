import './forum-topic-message-list.css';
import React, { FC } from 'react';
import { Box, Grid } from 'grommet';
import b_ from 'b_';
import { TopicMessage } from '../../types';
import { AvatarWithFallback } from '../../../../components/AvatarWithFallback/AvatarWithFallback';
import { getUserFullName } from '../../../../common/helpers';
import { MarkdownSafe } from '../../../../components/MarkdownSafe/MarkdownSafe';

const messageBlock = b_.lock('forum-topic-message');

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
    <Box className={messageBlock({ 'current-user': isCurrentUser })}>
      <Box className={messageBlock('author')} direction="row" align="center">
        <AvatarWithFallback url={message.user.avatar} size={36} />

        <Box direction="row" align="center">
          <div className={messageBlock('author-name')}>
            {userName}
          </div>

          <div className={messageBlock('date')}>
            {date}
          </div>
        </Box>
      </Box>

      <div className={messageBlock('text')}>
        <MarkdownSafe>
          {message.text}
        </MarkdownSafe>
      </div>
    </Box>
  );
};

const listBlock = b_.lock('forum-topic-message-list');

interface Props {
  messages: TopicMessage[];
  currentUserId: number;
}

export const ForumTopicMessageList: FC<Props> = ({ messages, currentUserId }) => {
  return (
    <Grid className={listBlock()} gap="20px">
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

