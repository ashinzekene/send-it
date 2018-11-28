import React from 'react';

const CloseButton = ({ onClick }) => (
  <button onClick={onClick} type="button" className="close" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
);

export default CloseButton;
