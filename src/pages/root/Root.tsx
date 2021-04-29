import './root.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { ROUTES } from '@common/constants';
import { getText } from '@common/langUtils';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  ResponsiveContext,
  Text,
  WorldMap,
} from 'grommet';

const block = b_.lock('root');

export const Root: FC = () => {
  const size = React.useContext(ResponsiveContext);
  const history = useHistory();

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: '#0000',
      }}
    >
      <Box
        justify="center"
        align="center"
        className={block('box')}
        style={{
          zIndex: 1,
        }}
      >
        <Box
          justify="center"
          align="center"
          style={{
            alignContent: 'center',
            backgroundColor: '#0000',
          }}
        >
          <Heading
            size="medium"
            margin="small"
            className={block('text_edging')}
            style={{ textTransform: 'uppercase', fontWeight: 'lighter' }}
          >
            {getText('root_become')}
          </Heading>
          <Box
            className={block('hr')}
            background={{ dark: '#fff', light: '#000' }}
          />
          <Heading
            size="large"
            margin={{ vertical: 'small' }}
            style={{ textTransform: 'uppercase' }}
          >
            {getText('root_a_winner')}
          </Heading>
          <Box
            className={block('hr')}
            background={{ dark: '#fff', light: '#000' }}
          />
          <Text
            margin="small"
            className={block('text_edging')}
            style={{
              textTransform: 'lowercase',
              fontSize: size === 'small' ? '13px' : '21px',
            }}
          >
            {getText('root_slogan')}
          </Text>
          <Button
            primary
            margin="medium"
            gap="large"
            label={getText('root_start')}
            onClick={() => history.push(ROUTES.GAME_LEVELS)}
          />
        </Box>
      </Box>
      <Box
        justify="center"
        align="center"
        pad="medium"
        className={block('box')}
        style={{
          zIndex: 0,
        }}
      >
        <WorldMap
          fill="horizontal"
          color={{ dark: '#202020', light: '#f0f0f0' }}
        />
      </Box>
    </div>
  );
};
