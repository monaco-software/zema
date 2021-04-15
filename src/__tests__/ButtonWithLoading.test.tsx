import React from 'react';
import renderer from 'react-test-renderer';
import { ButtonWithLoading } from '@components/ButtonWithProgress/ButtonWithLoading';

it('<ButtonWithLoading /> should render plain button', () => {
<<<<<<< HEAD
  const tree = renderer.create(
    <ButtonWithLoading
      isLoading={false}
    />
  ).toJSON();
=======
  const tree = renderer
    .create(<ButtonWithLoading isLoading={false} />)
    .toJSON();
>>>>>>> dev

  expect(tree).toMatchSnapshot();
});

it('<ButtonWithLoading /> should render button with loading icon', () => {
<<<<<<< HEAD
  const tree = renderer.create(
    <ButtonWithLoading
      isLoading={true}
    />
  ).toJSON();
=======
  const tree = renderer.create(<ButtonWithLoading isLoading={true} />).toJSON();
>>>>>>> dev

  expect(tree).toMatchSnapshot();
});
