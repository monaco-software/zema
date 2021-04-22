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
        style={{
          alignContent: 'center',
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#eee0',
          zIndex: 1,
        }}
      >
        <Box
          justify="center"
          align="center"
          style={{
            alignContent: 'center',
            backgroundColor: '#eee0',
          }}
        >
          <Heading
            size="medium"
            margin="small"
            style={{ fontWeight: 'lighter' }}
          >
            {getText('root_become')}
          </Heading>
          <Box
            className={block('hr')}
            background={{ dark: '#fff', light: '#000' }}
          />
          <Heading size="large" margin={{ vertical: 'small' }}>
            {getText('root_a_winner')}
          </Heading>
          <Box
            className={block('hr')}
            background={{ dark: '#fff', light: '#000' }}
          />
          <Text
            margin="small"
            style={{
              fontWeight: 'lighter',
              maxWidth: '100%',
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
        style={{
          alignContent: 'center',
          position: 'absolute',
          width: '100vw',
          height: '100vh',
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
