//<Icon icon="mdi:visibility" />
import React from 'react';
import Iconify, { IconifyProps } from './Iconify';

const ViewIcon: React.FC<Omit<IconifyProps, 'icon'>> = (props) => {
  return <Iconify icon="mdi:visibility" color="text.primary" width={14} {...props} />;
};

export default ViewIcon;
