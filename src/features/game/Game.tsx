import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

export const Game: FC = () => {
  const history = useHistory();
  const canvas = React.createRef<HTMLCanvasElement>();
  return (
    <div className="Game">
      <canvas ref={canvas} />
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
