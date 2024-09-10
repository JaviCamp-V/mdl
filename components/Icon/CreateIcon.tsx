//<Icon icon="mdi:add-circle" /
//<Icon icon="ic:round-add" />
//<Icon icon="mdi:add" />
import React from 'react';
import Iconify, { IconifyProps } from './Iconify';

const CreateIcon: React.FC<Omit<IconifyProps, 'icon'>> = (props) => {
  return <Iconify icon="mdi:add" color="text.primary" width={14} {...props} />;
};

export default CreateIcon;
