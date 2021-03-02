import './navbar.css';

import React, { FC, useEffect, useRef, useState } from 'react';
import b_ from 'b_';
import { NavLink } from 'react-router-dom';
import { AppsRounded, Chat, Home, Trophy, User } from 'grommet-icons';
import { ROUTES } from '@common/constants';
import { Gamepad } from 'grommet-icons/es6';
import { Icon } from 'grommet-icons/icons';
import { getText } from '@common/langUtils';
import { GROMMET_COLORS } from '../App/grommetTheme';

const block = b_.lock('navbar');

const Separator = () => {
  return (
    <div className={block('separator')} />
  );
};

interface NavbarItemProps {
  route: ROUTES;
  exact?: boolean;
  IconComponent: Icon;
  text?: string;
}
const NavbarItem: FC<NavbarItemProps> = ({ route, exact, IconComponent, text }) => {
  return (
    <NavLink exact={exact} to={route} className={block('link')} activeClassName={block('link', { active: true })}>
      <div className={block('link-icon-wrap')}>
        <IconComponent color={GROMMET_COLORS.LIGHT_1} size="18" className={block('link-icon')} />
      </div>
      <div className={block('link-text')}>
        {text}
      </div>
    </NavLink>
  );
};

export const Navbar: FC = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [withTransition, setWithTransition] = useState(false);

  const mouseLeaveTimeout = useRef<number>();

  const onMouseEnter = () => {
    clearTimeout(mouseLeaveTimeout.current);
    setIsHidden(false);
  };

  const onMouseLeave = () => {
    clearTimeout(mouseLeaveTimeout.current);
    mouseLeaveTimeout.current = setTimeout(() => {
      setIsHidden(true);
    }, 1000) as unknown as number;
  };

  useEffect(() => {
    // Хак. Чтобы при первом рендере не было анимации transform,
    // т.к. в css используется transform: translate(-50%, 0); для корректного позиционирования
    const setTransitionTimeout = setTimeout(() => {
      setWithTransition(true);
    }, 0);

    mouseLeaveTimeout.current = setTimeout(() => {
      setIsHidden(true);
    }, 2000) as unknown as number;

    return () => {
      clearTimeout(setTransitionTimeout);
      clearTimeout(mouseLeaveTimeout.current);
    };
  }, []);

  return (
    <nav
      className={block({ 'hidden': isHidden, 'with-transition': withTransition })}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <NavbarItem
        exact
        route={ROUTES.ROOT}
        IconComponent={Home}
        text={getText('navbar_root')}
      />

      <Separator />

      <NavbarItem
        exact
        route={ROUTES.GAME}
        IconComponent={Gamepad}
        text={getText('navbar_game')}
      />

      <NavbarItem
        route={ROUTES.GAME_LEVELS}
        IconComponent={AppsRounded}
        text={getText('navbar_game_levels')}
      />

      <Separator />

      <NavbarItem
        route={ROUTES.LEADERBOARD}
        IconComponent={Trophy}
        text={getText('navbar_leaderboard')}
      />

      <NavbarItem
        exact
        route={ROUTES.FORUM}
        IconComponent={Chat}
        text={getText('navbar_forum')}
      />

      <Separator />

      <NavbarItem
        route={ROUTES.ACCOUNT}
        IconComponent={User}
        text={getText('navbar_account')}
      />
    </nav>
  );
};
