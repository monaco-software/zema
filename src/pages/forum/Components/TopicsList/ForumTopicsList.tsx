import './forum-topics-list.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { Topic } from '../../types';
import { Grid, Heading } from 'grommet';
import { Link } from 'react-router-dom';
import { ROUTES } from '@common/constants';
import { getText } from '@common/langUtils';

const block = b_.lock('forum-topics-list');

const dateFormatter = new Intl.DateTimeFormat();

interface TopicProps extends Topic {
  url: string;
}

const Topic: FC<TopicProps> = ({ name, url, createTimestamp }) => {
  const dateString = dateFormatter.format(createTimestamp);
  const dateFullString = `${getText('forum_topic_create_date')} ${dateString}`;

  return (
    <Link to={url} className={block('topic')}>
      <Heading className={block('topic-name')} level={4} margin="none" fill>
        {name}
      </Heading>
      <p className={block('create-date')}>
        {dateFullString}
      </p>
    </Link>
  );
};

interface Props {
  topics: Topic[];
}

export const ForumTopicsList: FC<Props> = ({ topics }) => {
  return (
    <Grid className={block()} gap="20px">
      {topics.map((topic) => {
        const url = ROUTES.FORUM_TOPIC.replace(':topicId', String(topic.id));

        return (
          <Topic
            key={topic.id}
            url={url}
            {...topic}
          />
        );
      })}
    </Grid>
  );
};
