import React from 'react';
import Iconify, { IconifyProps } from './Iconify';

const EditIcon: React.FC<Omit<IconifyProps, 'icon'>> = (props) => {
  return <Iconify icon="mdi:edit-outline" color="text.primary" width={14} {...props} />;
};

export default EditIcon;
