import './game-over.css';
import React, { FC } from 'react';
import b_ from 'b_';
import { Box, Button, Grommet, Heading, Image, Main } from 'grommet';
import { getText } from '../../common/langUtils';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../common/constants';
import { useAuth } from '../../hooks';
import skullImage from '../game/assets/images/skull.png';

const block = b_.lock('game-over');

export const GameOver: FC = () => {
  useAuth(true);

  const history = useHistory();

  const goToHome = () => history.push(ROUTES.ROOT);
  const goToLevels = () => history.push(ROUTES.GAME_LEVELS);
  const goToGame = () => history.push(ROUTES.GAME);

  const color = '#FFFFFFC0';

  const theme = {
    button: {
      color: color,
    },
  };

  return (
    <div className={block()}>
      <Grommet theme={theme}>
        <Main justify="center" align="center" pad={{ vertical: 'xlarge' }}>
          <Box gap="small" className={block('box_game')}>
            <Heading color={color}>
              {getText('game_over_page_header')}
            </Heading>
            <Box>
              <Image src={skullImage} />
            </Box>
            <Box gap="medium" pad="large">
              <Button className={block('button')}
                onClick={goToGame} label={getText('game_over_to_game_button')} />
              <Button className={block('button')}
                onClick={goToLevels} label={getText('game_over_to_levels_button')} />
              <Button className={block('button')}
                onClick={goToHome} label={getText('game_over_to_home_button')} />
            </Box>
          </Box>
        </Main>
      </Grommet>
    </div>
  );
};

