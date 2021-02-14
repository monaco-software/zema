import './loading-overlay.css';

import React, { FC } from 'react';
import b_ from 'b_';
import { Spinner, SpinnerProps } from '../Spinner/Spinner';

const block = b_.lock('loading-overlay');

interface Props extends SpinnerProps {
  isLoading: boolean;
}

export const LoadingOverlay: FC<Props> = ({ isLoading, children, ...restProps }) => {
  return (
    <div className={block({ 'show': isLoading })}>
      <div className={block('children')}>
        {children}
      </div>
      {isLoading &&
        <div className={block('layer')}>
          <Spinner {...restProps} />
        </div>
      }
    </div>
  );
};
