import React from 'react';
import Iconify, { IconifyProps } from './Iconify';

const DeleteIcon: React.FC<Omit<IconifyProps, 'icon'>> = (props) => {
  return <Iconify icon="mdi:delete-outline" color="text.primary" width={14} {...props} />;
};

export default DeleteIcon;
