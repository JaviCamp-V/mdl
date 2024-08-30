import React from 'react';
import Iconify, { IconifyProps } from './Iconify';

const SearchIcon: React.FC<Omit<IconifyProps, 'icon'>> = (props) => {
  return <Iconify icon="mdi:search" color="text.primary" fontSize={24} {...props} />;
};

export default SearchIcon;
