import './forum-topic-message-modal.css';
import b_ from 'b_';
import React, { ChangeEvent, MouseEvent, FC } from 'react';
import { getText } from '@common/langUtils';
import { Layer, Tabs, Tab, TextArea, Box, Text } from 'grommet';
import { MarkdownSafe } from '@components/MarkdownSafe/MarkdownSafe';
import { ButtonWithLoading } from '@components/ButtonWithProgress/ButtonWithLoading';

const block = b_.lock('forum-topic-message-modal');

interface Props {
  value: string;
  isLoading: boolean;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (event: MouseEvent<HTMLButtonElement>) => void;
  onClose: VoidFunction;
}

export const ForumTopicMessageModal: FC<Props> = ({
  value,
  isLoading,
  onChange,
  onSend,
  onClose,
}) => {
  return (
    <Layer
      className={block()}
      style={{ maxWidth: 1000 }}
      position="bottom"
      onClickOutside={onClose}
      onEsc={onClose}
    >
      <Tabs className={block('tabs')} alignControls="start" flex>
        <Tab title={getText('forum_topic_input_message_tab')}>
          <Box className={block('textarea-with-controls')}>
            <TextArea
              className={block('textarea')}
              resize={false}
              value={value}
              onChange={onChange}
              autoFocus
            />

            <Box
              className={block('controls')}
              direction="row"
              justify="between"
            >
              <div className={block('markdown-hint')}>
                {getText('forum_topic_input_markdown_support')}
                &nbsp;
                <Text as="span" weight="bold" size="inherit">
                  {getText('forum_topic_input_markdown')}
                </Text>
              </div>

              <ButtonWithLoading
                primary
                size="small"
                isLoading={isLoading}
                spinnerSize={16}
                onClick={onSend}
                label={getText('forum_topic_input_submit')}
              />
            </Box>
          </Box>
        </Tab>

        <Tab title={getText('forum_topic_input_preview_tab')}>
          <div className={block('preview')}>
            <MarkdownSafe>{value}</MarkdownSafe>
          </div>
        </Tab>
      </Tabs>
    </Layer>
  );
};
