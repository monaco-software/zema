import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

export const Forum: FC = () => {
  const history = useHistory();

  return (
    <div className="Forum">
      Forum page
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
