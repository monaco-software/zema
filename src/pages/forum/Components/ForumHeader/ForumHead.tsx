import React, { FC } from 'react';
import { Box, Button, Heading } from 'grommet';
import { getText } from '../../../../common/langUtils';
import { Add } from 'grommet-icons';

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
