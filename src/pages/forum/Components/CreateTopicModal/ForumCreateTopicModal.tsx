import React, { FC } from 'react';
import { Box, Button, Form, FormExtendedEvent, FormField, Heading, Layer, TextInput, TypedForm } from 'grommet';
import { getText } from '../../../../common/langUtils';
import { CreateTopicFormFields } from '../../types';
import { LoadingOverlay } from '../../../../components/LoadingOverlay/LoadingOverlay';

const TypedForm = Form as TypedForm<CreateTopicFormFields>;

const messages = {
  required: getText('required_field'),
};

interface Props {
  onClose: VoidFunction;
  formValue: CreateTopicFormFields;
  onChange: (value: CreateTopicFormFields) => void;
  onSubmit: (event: FormExtendedEvent<CreateTopicFormFields>) => void;
  isLoading: boolean;
}

export const ForumCreateTopicModal: FC<Props> = ({ onClose, formValue, onChange, onSubmit, isLoading }) => {
  return (
    <Layer position="center" onClickOutside={onClose} onEsc={onClose}>
      <LoadingOverlay isLoading={isLoading}>
        <Box pad="medium" gap="small" width="medium">
          <Heading level={4} margin="none" textAlign="center">
            {getText('forum_create_topic_modal_header')}
          </Heading>

          <TypedForm
            value={formValue}
            onChange={onChange}
            onSubmit={onSubmit}
            messages={messages}
          >
            <FormField
              label={getText('form_topic_name')}
              htmlFor="forum_create_topic_name"
              name="topicName"
              required
            >
              <TextInput id="forum_create_topic_name" name="topicName" maxLength={140} autoFocus />
            </FormField>

            <Button
              primary
              fill="horizontal"
              size="small"
              type="submit"
              margin={{ top: 'small' }}
              label={getText('forum_create_topic_form_submit')}
            />
          </TypedForm>
        </Box>
      </LoadingOverlay>
    </Layer>
  );
};
