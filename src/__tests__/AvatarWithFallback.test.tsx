import React from 'react';
import renderer from 'react-test-renderer';
import { AvatarWithFallback } from '@components/AvatarWithFallback/AvatarWithFallback';

it('<AvatarWithFallback /> should render fallback icon', () => {
  const tree = renderer.create(
    <AvatarWithFallback
      size={64}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('<AvatarWithFallback /> should render image', () => {
  const tree = renderer.create(
    <AvatarWithFallback
      size={64}
      url="some-url"
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
