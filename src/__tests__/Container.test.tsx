import React from 'react';
import renderer from 'react-test-renderer';
import { Container } from '@components/Container/Container';

it('<Container /> should render content', () => {
<<<<<<< HEAD
  const tree = renderer.create(
    <Container>
      some content
    </Container>
  ).toJSON();
=======
  const tree = renderer.create(<Container>some content</Container>).toJSON();
>>>>>>> dev

  expect(tree).toMatchSnapshot();
});
