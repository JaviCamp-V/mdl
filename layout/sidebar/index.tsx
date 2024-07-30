'use client';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, ClickAwayListener, Drawer, IconButton, Toolbar, Typography } from '@mui/material';

interface SideBarProps {}
const SideBar: React.FC<SideBarProps> = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <React.Fragment>
        <IconButton onClick={() => setOpen((prev) => !prev)}>
          <MenuIcon sx={{color: "#fff", fontSize: 28}}/>
        </IconButton>
        <Drawer
          anchor="right"
          variant="persistent"
          open={open}
          sx={{
            width: 240,
            display: open ? 'block' : 'none',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
              backgroundColor: '#242526'
            }
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', marginY: 2 }}>
              Menu
            </Typography>
          </Box>
        </Drawer>
      </React.Fragment>
    </ClickAwayListener>
  );
};

export default SideBar;
