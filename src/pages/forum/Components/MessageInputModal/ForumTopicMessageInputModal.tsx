import './forum-topic-message-input-modal.css';
import React, { ChangeEvent, MouseEvent, FC } from 'react';
import { Layer, Tabs, Tab, TextArea, Markdown, Box } from 'grommet';
import b_ from 'b_';
import { getText } from '../../../../common/langUtils';
import { ButtonWithLoading } from '../../../../components/ButtonWithProgress/ButtonWithLoading';

const block = b_.lock('forum-topic-message-input-modal');

interface Props {
  value: string;
  isLoading: boolean;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (event: MouseEvent<HTMLButtonElement>) => void;
  onClose: VoidFunction;
}

export const ForumTopicMessageInputModal: FC<Props> = ({ value, isLoading, onChange, onSend, onClose }) => {
  return (
    <Layer className={block()} position="bottom" onClickOutside={onClose} onEsc={onClose}>
      <Tabs className={block('tabs')} alignControls="start" flex>
        <Tab title={getText('forum_topic_input_message_tab')}>
          <Box className={block('textarea-wrap')}>
            <TextArea
              className={block('textarea')}
              resize={false}
              value={value}
              onChange={onChange}
              autoFocus
            />

            <Box className={block('controls')} direction="row" justify="between">
              <div className={block('markdown-hint')}>
                {getText('forum_topic_input_markdown_support')}
                &nbsp;
                <span className={block('markdown-hint-highlight')}>{getText('forum_topic_input_markdown')}</span>
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
            <Markdown>
              {value}
            </Markdown>
          </div>
        </Tab>
      </Tabs>
    </Layer>
  );
};

