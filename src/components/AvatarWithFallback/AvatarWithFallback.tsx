import React, { ComponentProps, FC, ReactNode } from 'react';
import { Avatar } from 'grommet';
import { User } from 'grommet-icons';
import { GROMMET_COLORS } from '../App/grommetTheme';

type AvatarProps = ComponentProps<typeof Avatar>;
type AvatarPropsWithoutSize = Omit<AvatarProps, 'size'>;

interface Props extends AvatarPropsWithoutSize {
  size: number;
  url?: string | null;
  placeholderNode?: ReactNode;
}

export const AvatarWithFallback: FC<Props> = ({
  url,
  size,
  placeholderNode,
  ...restProps
}) => {
  const avatarSize = `${size}px`;
  const iconSize = Math.floor(size * 0.4).toString();

  if (url) {
    return (
      <Avatar src={url} size={avatarSize} {...restProps} />
    );
  }

  return (
    <Avatar size={avatarSize} background={GROMMET_COLORS.BRAND} {...restProps}>
      {placeholderNode ?? <User color={GROMMET_COLORS.LIGHT_1} size={iconSize} />}
    </Avatar>
  );
};
