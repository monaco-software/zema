import './container.css';
import b_ from 'b_';
import React, { FC, HTMLAttributes } from 'react';

const block = b_.lock('container');

export const Container: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...restProps
}) => {
  const classNameString = className ? ` ${className}` : '';
  const containerClass = `${block()}${classNameString}`;

  return <div className={containerClass} {...restProps} />;
};
