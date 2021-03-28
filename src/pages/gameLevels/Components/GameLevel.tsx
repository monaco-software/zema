import './game-level.css';
import b_ from 'b_';
import React, { FC } from 'react';
import { Sign } from './Sign';
import { Level } from '../../game/types';
import { useAction } from '@common/hooks';
import { ROUTES } from '@common/constants';
import { getText } from '@common/langUtils';
import { useHistory } from 'react-router-dom';
import { gameActions } from '../../game/reducer';
import { Card, CardBody, CardFooter, CardHeader, Image } from 'grommet';

const block = b_.lock('game-level');

interface Props {
  key: number;
  levelIndex: number;
  levelObject: Level;
  isAllowed: boolean;
  isSelected: boolean;
}

export const GameLevel: FC<Props> = ({ levelIndex, levelObject, isAllowed, isSelected }) => {
  const history = useHistory();
  const setCurrentLevel = useAction(gameActions.setCurrentLevel);

  // возвращаем функцию, если можно перейти
  // и undefined - если нет.
  // Надо для того, чтобы браузер не
  // показывал pointer курсор
  // над недоступным элементом
  const goToLevel = () => {
    if (!isAllowed) { return undefined; }
    return () => {
      setCurrentLevel(levelIndex);
      history.push(ROUTES.GAME);
    };
  };

  return (
    <Card
      className={block( { 'disallowed': !isAllowed, 'selected': isSelected })}
      onClick={goToLevel()}
      width="small"
      elevation={isSelected ? 'medium' : 'xsmall'}
    >
      <CardHeader className={block('header')} gap="none">
        <span className={block('header-status')}>
          <Sign isAllowed={isAllowed} />
        </span>
        <span className={block('header-level')}>
          {getText('levels_page_level_word')} {levelIndex + 1}
        </span>
      </CardHeader>
      <CardBody>
        <Image src= {levelObject.thumbnail} />
      </CardBody>
      <CardFooter pad="x-small" className={block('footer')}>
        <div style={{ margin: 'auto', alignContent: 'center' }}>
          {levelObject.title}
        </div>
      </CardFooter>
    </Card>
  );
};
