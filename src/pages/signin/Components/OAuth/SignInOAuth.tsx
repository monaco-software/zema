import './sign-in-oauth.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { Heading } from 'grommet';
import { getText } from '@common/langUtils';
import { IconYandex } from '../../../../icons/IconYandex';

const block = b_.lock('sign-in-oauth');

interface Props {
  onYandexOAuth: VoidFunction;
}

export const SignInOAuth: FC<Props> = ({ onYandexOAuth }) => {
  return (
    <div className={block()}>
      <Heading level={5} textAlign="center">
        {getText('signin_oauth_title')}
      </Heading>

      <div className={block('buttons-wrap')}>
        <button className={block('button')} onClick={onYandexOAuth}>
          <IconYandex />
        </button>
      </div>
    </div>
  );
};
