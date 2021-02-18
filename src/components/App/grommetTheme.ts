import { grommet, ThemeType } from 'grommet';
import { deepMerge } from 'grommet/utils';

export const grommetTheme: ThemeType = deepMerge(grommet, {
  global: {
    font: {
      size: '16px',
    },
  },
  formField: {
    border: {
      error: {
        color: 'border',
      },
      color: 'border',
      side: 'all',
    },
    disabled: {
      background: {
        color: undefined,
      },
      border: {
        color: 'status-disabled',
      },
      label: {
        color: 'status-disabled',
      },
    },
    error: {
      background: {
        color: { light: '#FF404033', dark: '#FF40404D' },
      },
      size: 'xsmall',
      margin: {
        start: 'none',
      },
    },
    help: {
      size: 'xsmall',
      color: 'text-weak',
      margin: {
        start: 'none',
        bottom: 'xsmall',
      },
    },
    info: {
      size: 'xsmall',
      color: 'text-weak',
      margin: {
        start: 'none',
      },
    },
    label: {
      size: 'small',
      color: 'text-weak',
      margin: {
        horizontal: 'none',
      },
    },
    round: '3px',
  },
  tab: {
    active: {
      color: 'brand',
    },
    color: '#444444',
    border: {
      color: 'black',
      active: {
        color: 'brand',
      },
      hover: {
        color: 'brand',
      },
    },
    hover: {
      color: 'brand',
    },
  },
});
