'use client';

import React from 'react';
import Menu from '@mui/material/Menu';

interface DropDownMenuProps {
  children: React.ReactNode;
  menuItems: React.ReactNode[];
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({ children, menuItems }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      {React.cloneElement(children as React.ReactElement, {
        onClick: handleClick,
        'aria-owns': anchorEl ? 'simple-menu' : undefined,
        'aria-haspopup': 'true',
        'aria-expanded': anchorEl ? 'true' : undefined
      })}
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
          .map((menuItem, index) => (
            <React.Fragment key={index}>{menuItem}</React.Fragment>
          ))}
      </Menu>
    </React.Fragment>
  );
};

export default DropDownMenu;
