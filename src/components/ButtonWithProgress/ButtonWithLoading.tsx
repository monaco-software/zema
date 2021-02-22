import React, { ComponentProps, FC } from 'react';
import { Button } from 'grommet';
import { Spinner, SpinnerProps } from '../Spinner/Spinner';

type ButtonProps = ComponentProps<typeof Button>;

interface Props extends ButtonProps {
  isLoading: boolean;
  spinnerSize?: SpinnerProps['size'];
  spinnerColor?: SpinnerProps['color'];
}

export const ButtonWithLoading: FC<Props> = ({ isLoading, spinnerSize, spinnerColor, ...restProps }) => {
  const spinnerIcon = isLoading
    ? <Spinner size={spinnerSize} color={spinnerColor} />
    : undefined;

  return (
    <Button
      disabled={isLoading}
      icon={spinnerIcon}
      {...restProps}
    />
  );
};

