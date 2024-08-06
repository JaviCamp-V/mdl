'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Button, Collapse, ListItem, ListItemButton, Menu, MenuItem, Typography } from '@mui/material';


interface ExpandableMenuItemProps {
  label: string;
  items: { label: string; href: string }[];
}
const ExpandableMenuItem: React.FC<ExpandableMenuItemProps> = ({ label, items }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    if (anchorEl !== event.currentTarget) setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box onMouseLeave={handleClose}>
      <Box
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        onMouseOver={handleClick}
        sx={anchorEl ? { borderBottom: '2px solid white' } : {}}
      >
        <Typography fontSize={16} fontWeight={400} textTransform="uppercase" sx={{ color: 'white' }}>
          {label}
        </Typography>
      </Box>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              mt: 1.5,
              backgroundColor: '#242526',
              boxShadow: '0 4px 8px rgba(255, 255, 255, 0.1);',
              minWidth: '10vw'
            }
          }
        }}
      >
        {items.map((item) => (
          <MenuItem key={item.label} href={item.href} sx={{ color: '#fff' }}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ExpandableMenuItem;