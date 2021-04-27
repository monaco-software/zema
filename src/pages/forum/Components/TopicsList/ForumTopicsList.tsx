import './forum-topics-list.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { Grid, Heading } from 'grommet';
import { Link } from 'react-router-dom';
import { ROUTES } from '@common/constants';
import { getText } from '@common/langUtils';
import { ForumTopic } from '@prisma/client';

const block = b_.lock('forum-topics-list');

const dateFormatter = new Intl.DateTimeFormat();

interface TopicProps extends ForumTopic {
  url: string;
}

const Topic: FC<TopicProps> = ({ title, url, createdAt }) => {
  const dateString = dateFormatter.format(new Date(createdAt));
  const dateFullString = `${getText('forum_topic_create_date')} ${dateString}`;

  return (
    <Link to={url} className={block('topic')}>
      <Heading className={block('topic-name')} level={4} margin="none" fill>
        {title}
      </Heading>
      <p className={block('create-date')}>{dateFullString}</p>
    </Link>
  );
};

interface Props {
  topics: ForumTopic[];
}

export const ForumTopicsList: FC<Props> = ({ topics }) => {
  return (
    <Grid className={block()} gap="20px">
      {topics.map((topic) => {
        const url = ROUTES.FORUM_TOPIC.replace(':topicId', String(topic.id));

        return <Topic key={topic.id} url={url} {...topic} />;
      })}
    </Grid>
  );
};
