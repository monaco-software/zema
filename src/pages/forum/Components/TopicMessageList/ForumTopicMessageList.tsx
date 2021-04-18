import './forum-topic-message-list.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { Box, Grid } from 'grommet';
import { AppState } from '@common/types';
import { UserObject } from '@api/schema';
import { getUserFullName } from '@common/helpers';
import { ForumTopicMessage } from '@prisma/client';
import { MarkdownSafe } from '@components/MarkdownSafe/MarkdownSafe';
import { AvatarWithFallback } from '@components/AvatarWithFallback/AvatarWithFallback';

const messageBlock = b_.lock('forum-topic-message');

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

interface MessageProps {
  message: ForumTopicMessage;
  user: UserObject;
  isCurrentUser: boolean;
}

const Message: FC<MessageProps> = ({ message, isCurrentUser, user }) => {
  const userName = getUserFullName(user);
  const date = dateFormatter.format(new Date(message.createdAt));

  return (
    <Box className={messageBlock({ 'current-user': isCurrentUser })}>
      <Box className={messageBlock('author')} direction="row" align="center">
        <AvatarWithFallback url={user.avatar} size={36} />

        <Box direction="row" align="center">
          <div className={messageBlock('author-name')}>{userName}</div>

          <div className={messageBlock('date')}>{date}</div>
        </Box>
      </Box>

      <div className={messageBlock('text')}>
        <MarkdownSafe>{message.text}</MarkdownSafe>
      </div>
    </Box>
  );
};

const listBlock = b_.lock('forum-topic-message-list');

interface Props {
  messages: ForumTopicMessage[];
  users: AppState['users'];
  currentUserId: number;
}

export const ForumTopicMessageList: FC<Props> = ({
  messages,
  users,
  currentUserId,
}) => {
  return (
    <Grid className={listBlock()} gap="20px">
      {messages.map((message) => {
        const user = users[message.userId] ?? {};
        const isCurrentUser = user.id === currentUserId;

        return (
          <Message
            key={message.id}
            message={message}
            user={user}
            isCurrentUser={isCurrentUser}
          />
        );
      })}
    </Grid>
  );
};
