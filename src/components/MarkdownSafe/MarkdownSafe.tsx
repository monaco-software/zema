import React, { ComponentProps, FC } from 'react';
import { Markdown } from 'grommet';

type MarkdownOptions = ComponentProps<typeof Markdown>;

interface Props extends MarkdownOptions {
  // https://github.com/probablyup/markdown-to-jsx#parsing-options
  options?: Record<string, any>;
}

export const MarkdownSafe: FC<Props> = ({ options = {}, ...restProps }) => {
  const safeOptions = {
    ...options,
    disableParsingRawHTML: true,
  };

  return (
    <Markdown
      {...restProps}
      // @ts-ignore В grommet косяк с типом, его просто нет))
      options={safeOptions}
    />
  );
};

