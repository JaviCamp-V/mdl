'use client';

import React from 'react';
import { Box, Menu, MenuItem, Typography } from '@mui/material';

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
        <Typography fontSize={13} fontWeight={500} textTransform="uppercase" sx={{ color: 'white' }}>
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
              mt: 2,
              backgroundColor: 'background.paper',
              boxShadow: '0 1px 1px rgba(0,0,0,.1)',
              border: '1px solid rgba(0, 0, 0, .14)',
              minWidth: '10vw'
            }
          }
        }}
      >
        {items.map((item) => (
          <MenuItem key={item.label} href={item.href} sx={{ color: '#fff', fontSize: 13 }}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ExpandableMenuItem;
