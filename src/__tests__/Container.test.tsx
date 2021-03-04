import React from 'react';
import renderer from 'react-test-renderer';
import { Container } from '@components/Container/Container';

it('<Container /> should render content', () => {
  const tree = renderer.create(
    <Container>
      some content
    </Container>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
