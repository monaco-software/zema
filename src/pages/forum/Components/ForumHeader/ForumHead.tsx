import React, { FC } from 'react';
import { Add } from 'grommet-icons';
import { getText } from '@common/langUtils';
import { Box, Button, Heading } from 'grommet';

interface Props {
  onTopicCreateClick: VoidFunction;
}

export const ForumHead: FC<Props> = ({ onTopicCreateClick }) => {
  const addIcon = <Add size="16px" />;

  return (
    <Box direction="row" justify="between" align="center">
      <Heading level={3}>
        {getText('forum_page_header')}
      </Heading>

      <Button
        icon={addIcon}
        primary
        size="small"
        label={getText('forum_create_topic_button')}
        onClick={onTopicCreateClick}
      />
    </Box>
  );
};
