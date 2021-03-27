import './navbar.css';
import b_ from 'b_';
import React, { FC, HTMLAttributes, useEffect, useRef, useState } from 'react';
import { isMobile } from '@common/utils';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@common/constants';
import { getText } from '@common/langUtils';
import { useAsyncAction } from '@common/hooks';
import { getIsSignedInd } from '@store/selectors';
import { GROMMET_COLORS } from '../App/grommetTheme';
import { asyncAppActions } from '@store/asyncActions';
import { Chat, Gamepad, Home, Icon, Logout, Trophy, User } from 'grommet-icons';

const block = b_.lock('navbar');

const Separator = () => {
  return <div className={block('separator')} />;
};

interface NavbarLinkItemProps {
  route: ROUTES;
  exact?: boolean;
  IconComponent: Icon;
  text?: string;
}
const NavbarLinkItem: FC<NavbarLinkItemProps> = ({
  route,
  exact,
  IconComponent,
  text,
}) => {
  return (
    <NavLink
      exact={exact}
      to={route}
      className={block('link')}
      activeClassName={block('link', { active: true })}
    >
      <div className={block('item-icon-wrap')}>
        <IconComponent
          color={GROMMET_COLORS.LIGHT_1}
          size="18"
          className={block('item-icon')}
        />
      </div>
      <div className={block('item-text')}>{text}</div>
    </NavLink>
  );
};

interface NavbarButtonItemProps extends HTMLAttributes<HTMLButtonElement> {
  IconComponent: Icon;
  text?: string;
}
const NavbarButtonItem: FC<NavbarButtonItemProps> = ({
  IconComponent,
  text,
  className,
  ...restProps
}) => {
  const baseClassName = block('button');
  const fullClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <button className={fullClassName} {...restProps}>
      <div className={block('item-icon-wrap')}>
        <IconComponent
          color={GROMMET_COLORS.LIGHT_1}
          size="18"
          className={block('item-icon')}
        />
      </div>
      <div className={block('item-text')}>{text}</div>
    </button>
  );
};

export const Navbar: FC = () => {
  const signOut = useAsyncAction(asyncAppActions.signOutUser);

  const isSignedIn = useSelector(getIsSignedInd);

  const [isHidden, setIsHidden] = useState(false);
  const [withTransition, setWithTransition] = useState(false);

  const mouseLeaveTimeout = useRef<number>();

  const onSignOutClick = () => signOut();

  const onMouseEnter = () => {
    clearTimeout(mouseLeaveTimeout.current);
    setIsHidden(false);
  };

  const onMouseLeave = () => {
    clearTimeout(mouseLeaveTimeout.current);
    mouseLeaveTimeout.current = window.setTimeout(() => {
      setIsHidden(true);
    }, 1000);
  };

  useEffect(() => {
    // Хак. Чтобы при первом рендере не было анимации transform,
    // т.к. в css используется transform: translate(-50%, 0); для корректного позиционирования
    const setTransitionTimeout = setTimeout(() => {
      setWithTransition(true);
    }, 0);

    mouseLeaveTimeout.current = window.setTimeout(() => {
      setIsHidden(true);
    }, 2000);

    return () => {
      clearTimeout(setTransitionTimeout);
      clearTimeout(mouseLeaveTimeout.current);
    };
  }, []);

  return (
    <nav
      className={
        isMobile
          ? block()
          : block({ hidden: isHidden, 'with-transition': withTransition })
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <NavbarLinkItem
        exact
        route={ROUTES.ROOT}
        IconComponent={Home}
        text={getText('navbar_root')}
      />

      <Separator />

      <NavbarLinkItem
        route={ROUTES.GAME_LEVELS}
        IconComponent={Gamepad}
        text={getText('navbar_game')}
      />

      <Separator />

      <NavbarLinkItem
        route={ROUTES.LEADERBOARD}
        IconComponent={Trophy}
        text={getText('navbar_leaderboard')}
      />

      <NavbarLinkItem
        exact
        route={ROUTES.FORUM}
        IconComponent={Chat}
        text={getText('navbar_forum')}
      />

      <Separator />

      <NavbarLinkItem
        route={ROUTES.ACCOUNT}
        IconComponent={User}
        text={getText('navbar_account')}
      />

      {isSignedIn && (
        <NavbarButtonItem
          text={getText('navbar_signout')}
          IconComponent={Logout}
          onClick={onSignOutClick}
        />
      )}
    </nav>
  );
};
