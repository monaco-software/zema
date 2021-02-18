import './game-level.css';
import React, { FC } from 'react';
import { Card, CardBody, CardFooter, CardHeader, Image } from 'grommet';
import { Lock, Star } from 'grommet-icons';
import b_ from 'b_';
import { useDispatch } from 'react-redux';
import { gameActions } from '../../game/reducer';
import { ROUTES } from '../../../common/constants';
import { useHistory } from 'react-router-dom';
import { Level } from '../../game/types';

const block = b_.lock('game-level');

interface Props {
  key: number;
  levelIndex: number;
  levelObject: Level;
  isAllowed: boolean;
  isSelected: boolean;
}

const getSign = (isAllowed: boolean) => {
  if (isAllowed) {
    return (
      <Star color="accent-4" />
    );
  }
  return (
    <Lock color="dark-4" />
  );
};

export const GameLevel: FC<Props> = ({ levelIndex, levelObject, isAllowed, isSelected }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  // возвращаем функцию, если можно перейти
  // и undefined - если нет.
  const goToLevel = () => {
    if (!isAllowed) { return; }
    return () => {
      dispatch(gameActions.setCurrentLevel(levelIndex));
      setTimeout(() => history.push(ROUTES.GAME), 0);
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
          {getSign(isAllowed)}
        </span>
        <span className={block('header-level')}>
          Уровень {levelIndex + 1}
        </span>
      </CardHeader>
      <CardBody>
        <Image src= {levelObject.thumbnail} />
      </CardBody>
      <CardFooter className={block('footer')}>
        {levelObject.title}
      </CardFooter>
    </Card>
  );
};
