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
  if (isLoading) {
    return (
      <Button {...restProps} disabled={true} icon={<Spinner size={spinnerSize} color={spinnerColor} />} />
    );
  }

  return (
    <Button {...restProps} />
  );
};

