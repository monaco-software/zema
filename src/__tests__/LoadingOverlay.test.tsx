import React from 'react';
import renderer from 'react-test-renderer';
import { LoadingOverlay } from '@components/LoadingOverlay/LoadingOverlay';

it('<LoadingOverlay /> should render content', () => {
  const tree = renderer
    .create(<LoadingOverlay isLoading={false}>some content</LoadingOverlay>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('<LoadingOverlay /> should render content with overlay', () => {
  const tree = renderer
    .create(
      <LoadingOverlay isLoading={true}>
        some content with loading overlay
      </LoadingOverlay>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
