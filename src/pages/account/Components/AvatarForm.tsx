import './avatar-form.css';
import b_ from 'b_';
import React, { ChangeEvent, FC, useRef } from 'react';
import { Box, Button } from 'grommet';
import { Camera } from 'grommet-icons';
import { AvatarWithFallback } from '@components/AvatarWithFallback/AvatarWithFallback';

const block = b_.lock('avatar-form');

interface Props {
  avatarUrl: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarForm: FC<Props> = ({ onChange, avatarUrl }) => {
  const cameraIcon = <Camera size="15px" />;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const onClick = () => {
    if (!fileInputRef.current) {
      return;
    }
    fileInputRef.current.click();
  };

  return (
    <Box align="center" className={block('box')} margin="small">
      <Button
        primary
        className={block('button')}
        icon={cameraIcon}
        onClick={onClick}
      />
      <AvatarWithFallback
        className={block('avatar', { dummy: !avatarUrl })}
        url={avatarUrl}
        size={150}
      />
      <input
        name="avatarFileInput"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        hidden
      />
    </Box>
  );
};
