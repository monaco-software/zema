import './container.css';
import React, { FC, HTMLAttributes } from 'react';
import b_ from 'b_';

const block = b_.lock('container');

export const Container: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...restProps }) => {
  const classNameString = className ? ` ${className}` : '';
  const containerClass = `${block()}${classNameString}`;

  return (
    <div
      className={containerClass}
      {...restProps}
    />
  );
};

