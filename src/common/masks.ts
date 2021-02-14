import { MaskedInputProps } from 'grommet';

type MaskedInputMask = MaskedInputProps['mask'];

export const phoneMask: MaskedInputMask = [
  { fixed: '8' },
  { fixed: ' ' },
  { fixed: '(' },
  {
    length: 3,
    regexp: /^[0-9]{1,3}$/,
    placeholder: 'xxx',
  },
  { fixed: ')' },
  { fixed: ' ' },
  {
    length: 3,
    regexp: /^[0-9]{1,3}$/,
    placeholder: 'xxx',
  },
  { fixed: '-' },
  {
    length: 4,
    regexp: /^[0-9]{1,4}$/,
    placeholder: 'xxxx',
  },
];
