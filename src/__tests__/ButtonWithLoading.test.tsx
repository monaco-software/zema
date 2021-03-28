import React from 'react';
import renderer from 'react-test-renderer';
import { ButtonWithLoading } from '@components/ButtonWithProgress/ButtonWithLoading';

it('<ButtonWithLoading /> should render plain button', () => {
  const tree = renderer
    .create(<ButtonWithLoading isLoading={false} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('<ButtonWithLoading /> should render button with loading icon', () => {
  const tree = renderer.create(<ButtonWithLoading isLoading={true} />).toJSON();

  expect(tree).toMatchSnapshot();
});
