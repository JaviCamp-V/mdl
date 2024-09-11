import React from 'react';
import Iconify, { IconifyProps } from './Iconify';

const CreateIcon: React.FC<Omit<IconifyProps, 'icon'>> = (props) => {
  return <Iconify icon="mdi:add" color="text.primary" width={14} {...props} />;
};

export default CreateIcon;
