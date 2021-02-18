import React, { FC, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { RouteParams, ROUTES } from '../../../common/constants';
import { useAuth } from '../../../hooks';
import { useSelector } from 'react-redux';
import { getForumTopicById } from '../selectors';

export const ForumTopic: FC = () => {
  useAuth();

  const history = useHistory();
  const { topicId } = useParams<RouteParams>();

  const topic = useSelector(getForumTopicById(Number(topicId)));

  useEffect(() => {
    if (!topic) {
      history.replace(ROUTES.FORUM);
    }
  }, [topic]);

  return (
    <div>Topic #{topicId}</div>
  );
};

