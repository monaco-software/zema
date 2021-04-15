import React from 'react';
import renderer from 'react-test-renderer';
import { AvatarWithFallback } from '@components/AvatarWithFallback/AvatarWithFallback';

it('<AvatarWithFallback /> should render fallback icon', () => {
<<<<<<< HEAD
  const tree = renderer.create(
    <AvatarWithFallback
      size={64}
    />
  ).toJSON();
=======
  const tree = renderer.create(<AvatarWithFallback size={64} />).toJSON();
>>>>>>> dev

  expect(tree).toMatchSnapshot();
});

it('<AvatarWithFallback /> should render image', () => {
<<<<<<< HEAD
  const tree = renderer.create(
    <AvatarWithFallback
      size={64}
      url="some-url"
    />
  ).toJSON();
=======
  const tree = renderer
    .create(<AvatarWithFallback size={64} url="some-url" />)
    .toJSON();
>>>>>>> dev

  expect(tree).toMatchSnapshot();
});
