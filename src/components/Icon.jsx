import React from 'react';

const Icon = ({ icon, ...props }) => (
  <svg {...props} dangerouslySetInnerHTML={{ __html: icon }}></svg>
);

export default Icon;
