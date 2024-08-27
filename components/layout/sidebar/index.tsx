'use client';

import React from 'react';
import SearchForm from '@/features/media/components/forms/Search';
import Close from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, ClickAwayListener, IconButton, Toolbar, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Link from '@/components/common/Link';
import model from '../model';


interface SideBarProps {}
const drawerWidth = 240;

const SideBar: React.FC<SideBarProps> = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ display: 'flex' }}>
        <IconButton onClick={() => setOpen((prev) => !prev)} sx={{ margin: 0, padding: 0 }}>
          <MenuIcon sx={{ color: '#fff', fontSize: 28 }} />
        </IconButton>
        <Drawer
          anchor="right"
          open={open}
          sx={{
            width: open ? drawerWidth : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : 0,
              boxSizing: 'border-box',
              backgroundColor: 'background.default'
            }
          }}
          variant="persistent"
        >
          <Toolbar disableGutters sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'space-between', height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 2, height: '100%' }}>
                <SearchForm responsive={false} />
                {Object.entries(model.navbarLinks).map(([label, links]) => (
                  <Box key={label}>
                    <Typography fontSize={15} fontWeight={700} textTransform="uppercase">
                      {label}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingLeft: 1, paddingTop: 0.5 }}>
                      {links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          sx={{ fontSize: 14, lineHeight: 1.5, color: 'text.primary' }}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <IconButton
                  onClick={() => setOpen(false)}
                  sx={{ margin: 0, padding: 0.5, backgroundColor: 'background.paper', borderRadius: 0.5 }}
                >
                  <Close sx={{ color: 'text.primary', fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Drawer>
      </Box>
    </ClickAwayListener>
  );
};

export default SideBar;