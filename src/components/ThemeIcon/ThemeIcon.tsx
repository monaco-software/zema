import React from 'react';
import { useSelector } from 'react-redux';
import { Blank, IconProps } from 'grommet-icons';
import { getCurrentTheme, getThemes } from '@store/selectors';

export const ThemeIcon = (
  props: JSX.IntrinsicAttributes & IconProps & React.SVGProps<SVGSVGElement>
) => {
  const currentTheme = useSelector(getCurrentTheme);
  const themes = useSelector(getThemes);

  return (
    <Blank {...props}>
      <path fillRule="nonzero" d={themes[currentTheme]?.icon} />
    </Blank>
  );
};
