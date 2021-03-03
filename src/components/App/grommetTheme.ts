import { deepMerge } from 'grommet/utils';
import { grommet, ThemeType } from 'grommet';

// https://v2.grommet.io/color
export enum GROMMET_COLORS {
  BRAND = 'brand',

  ACCENT_1 = 'accent-1',
  ACCENT_2 = 'accent-2',
  ACCENT_3 = 'accent-3',
  ACCENT_4 = 'accent-4',

  NEUTRAL_1 = 'neutral-1',
  NEUTRAL_2 = 'neutral-2',
  NEUTRAL_3 = 'neutral-3',
  NEUTRAL_4 = 'neutral-4',

  STATUS_CRITICAL = 'status-critical',
  STATUS_ERROR = 'status-error',
  STATUS_WARNING = 'status-warning',
  STATUS_OK = 'status-ok',
  STATUS_UNKNOWN = 'status-unknown',
  STATUS_DISABLED = 'status-disabled',

  LIGHT_1 = 'light-1',
  LIGHT_2 = 'light-2',
  LIGHT_3 = 'light-3',
  LIGHT_4 = 'light-4',
  LIGHT_5 = 'light-5',
  LIGHT_6 = 'light-6',

  DARK_1 = 'dark-1',
  DARK_2 = 'dark-2',
  DARK_3 = 'dark-3',
  DARK_4 = 'dark-4',
  DARK_5 = 'dark-5',
  DARK_6 = 'dark-6',
}

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
      container: {
        className: 'form-field_error_container',
      },
      className: 'form-field_error_message',
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
      color: GROMMET_COLORS.BRAND,
    },
    color: '#444444',
    border: {
      color: 'black',
      active: {
        color: GROMMET_COLORS.BRAND,
      },
      hover: {
        color: GROMMET_COLORS.BRAND,
      },
    },
    hover: {
      color: GROMMET_COLORS.BRAND,
    },
  },
});
