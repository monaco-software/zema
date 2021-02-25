import './avatar-form.css';

import React, { FC, useEffect, useRef } from 'react';
import b_ from 'b_';
import { Box, Button, Form, TypedForm } from 'grommet';
import { AvatarFormFields } from '../../types';
import { AvatarWithFallback } from '../../../../components/AvatarWithFallback/AvatarWithFallback';
import { Camera } from 'grommet-icons';

const TypedForm = Form as TypedForm<AvatarFormFields>;

const block = b_.lock('avatar-form');

interface Props {
  onSaveAvatar: (value: AvatarFormFields) => void;
  avatarUrl: string;
}

export const AvatarForm: FC<Props> = ({
  onSaveAvatar,
  avatarUrl,
}) => {
  const cameraIcon = <Camera size="15px" />;
  const fileInputRef = useRef<HTMLInputElement| null>(null);

  const onClick = () => {
    if (!fileInputRef.current) { return; }
    fileInputRef.current.click();
  };

  useEffect(() => {
    // TODO добавить уведомления
    const fileInput = fileInputRef.current;
    if (!fileInput) { throw new Error('Cant find file input'); }

    fileInput.onchange = () => {
      if (!fileInput.files || !(fileInput.files[0] instanceof File)) {
        throw new Error('Cant update file input');
      }
      // проверяем что это действительно изображение
      const testImage = new Image();

      testImage.onload = () => {
        // @ts-ignore ибо уже проверили в fileInput.onchange
        onSaveAvatar({ avatarFileInput: fileInput.files[0] } );
      };

      testImage.onerror = () => {
        // TODO добавить уведомление
        console.log('FILE ERROR');
      };

      testImage.src = URL.createObjectURL(fileInput.files[0]);
    };
  }, []);

  return (
    <TypedForm>
      <Box
        align="center"
        className={block('box')}
        margin="small"
      >
        <Button
          primary
          className={block('button')}
          icon={cameraIcon}
          onClick={onClick}
        />
        <AvatarWithFallback url={avatarUrl} size={150} />
        <input
          name="avatar"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
        />
      </Box>
    </TypedForm>
  );
};
