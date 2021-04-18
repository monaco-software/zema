import './forum-topic-message-list.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { Box, Grid } from 'grommet';
import { AppState } from '@common/types';
import { UserObject } from '@api/schema';
import { getUserFullName } from '@common/helpers';
import { MarkdownSafe } from '@components/MarkdownSafe/MarkdownSafe';
import { AvatarWithFallback } from '@components/AvatarWithFallback/AvatarWithFallback';
import { ForumMessagesTree } from '@pages/forum/types';

const messageBlock = b_.lock('forum-topic-message');

const MESSAGE_OFFSET = 20;
const MESSAGE_OFFSET_MAX = MESSAGE_OFFSET * 10;

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

interface MessageProps {
  message: ForumMessagesTree;
  users: Record<number, UserObject>;
  currentUserId: number;
  level: number;
}

const Message: FC<MessageProps> = ({
  message,
  currentUserId,
  users,
  level,
}) => {
  const user = users[message.userId] ?? {};
  const isCurrentUser = user.id === currentUserId;
  const userName = getUserFullName(user);
  const date = dateFormatter.format(new Date(message.createdAt));

  const offset = Math.min(MESSAGE_OFFSET * level, MESSAGE_OFFSET_MAX);

  return (
    <>
      <Box
        className={messageBlock({ 'current-user': isCurrentUser })}
        style={{ marginLeft: offset }}
      >
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

      {message.children?.map((item) => {
        return (
          <Message
            key={item.id}
            message={item}
            users={users}
            currentUserId={currentUserId}
            level={level + 1}
          />
        );
      })}
    </>
  );
};

const listBlock = b_.lock('forum-topic-message-list');

interface Props {
  messages: ForumMessagesTree[];
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
        return (
          <Message
            key={message.id}
            message={message}
            currentUserId={currentUserId}
            users={users}
            level={0}
          />
        );
      })}
    </Grid>
  );
};
