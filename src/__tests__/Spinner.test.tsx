import React from 'react';
import renderer from 'react-test-renderer';
import { Spinner } from '@components/Spinner/Spinner';

it('<Spinner /> should render', () => {
<<<<<<< HEAD
  const tree = renderer.create(
    <Spinner
      size={128}
      color="#ffffff"
    />
  ).toJSON();
=======
  const tree = renderer.create(<Spinner size={128} color="#ffffff" />).toJSON();
>>>>>>> dev

  expect(tree).toMatchSnapshot();
});
