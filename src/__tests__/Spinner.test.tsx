import React from 'react';
import renderer from 'react-test-renderer';
import { Spinner } from '@components/Spinner/Spinner';

it('<Spinner /> should render', () => {
  const tree = renderer.create(<Spinner size={128} color="#ffffff" />).toJSON();

  expect(tree).toMatchSnapshot();
});
