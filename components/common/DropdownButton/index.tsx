'use client';

import React from 'react';
import { Button, ClickAwayListener, ListItemIcon, ListItemText, MenuItem, SxProps } from '@mui/material';
import Menu from '@mui/material/Menu';
import Iconify from '@/components/Icon/Iconify';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface DropDownMenuProps {
  title: string;
  buttonStyle?: SxProps;
  menuItems: MenuItem[];
}

const DropdownButton: React.FC<DropDownMenuProps> = ({ title, menuItems, buttonStyle }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (onClick: () => void) => {
    onClick();
    handleClose();
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClick}
        sx={{ textTransform: 'capitalize', ...buttonStyle }}
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
        endIcon={<Iconify icon={anchorEl ? 'mdi:arrow-drop-up' : 'mdi:arrow-down-drop'} width={20} color={'inherit'} />}
      >
        {title}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose, dense: true, sx: { paddingX: 0, margin: 0, gap: 1 } }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        slotProps={{
          paper: {
            elevation: 1,
            sx: {
              padding: 0,
              margin: 0,
              overflow: 'visible',
              backgroundColor: 'background.paper',
              boxShadow: '0 1px 1px rgba(0,0,0,.1)',
              border: '1px solid rgba(0, 0, 0, .14)',
              borderColor: 'info.main',
              maxWidth: '100%'
            }
          }
        }}
      >
        {menuItems
          .filter((menuItem) => menuItem)
          .map((menuItem) => (
            <MenuItem key={menuItem.id} onClick={() => handleMenuItemClick(menuItem.onClick)}>
              <ListItemIcon>{menuItem.icon}</ListItemIcon>
              <ListItemText>{menuItem.label}</ListItemText>
            </MenuItem>
          ))}
      </Menu>
    </React.Fragment>
  );
};

export default DropdownButton;
