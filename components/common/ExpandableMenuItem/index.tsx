'use client';

import React from 'react';
import { Box, Menu, MenuItem, Typography } from '@mui/material';


interface ExpandableMenuItemProps {
  label: string;
  items: { label: string; href: string }[];
}
const ExpandableMenuItem: React.FC<ExpandableMenuItemProps> = ({ label, items }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (anchorEl !== event.currentTarget) setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Typography
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
        onClick={handleClick}
        fontSize={13}
        fontWeight={500}
        textTransform="uppercase"
        sx={{
          color: 'white',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          pointerEvents: 'auto',
          borderBottom: anchorEl ? '1.5px solid white' : 'none'
        }}
      >
        {label}
      </Typography>
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
          <MenuItem key={item.label} href={item.href} sx={{ color: 'text.primary', fontSize: 13 }}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ExpandableMenuItem;