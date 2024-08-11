'use client';

import React from 'react';
import { capitalCase } from 'change-case';
import { signOut } from 'next-auth/react';
import { Popover } from 'react-tiny-popover';
import { ClickAwayListener, Divider, ListItemIcon, ListItemText, MenuItem, MenuList, Paper } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { logout } from '@/server/authActions';
import Iconify from '@/components/Icon/Iconify';
import { userRoutes } from '@/libs/routes';


interface ProfileDropdownProps {
  username: string;
  avatar?: string | null;
}

const icons = {
  profile: 'mdi:user-circle-outline',
  watchlist: 'mdi:view-list-outline',
  custom_lists: 'mdi:format-list-numbered',
  settings: 'mdi:mixer-settings-vertical',
  logout: 'mdi:logout'
};
const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ username }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await logout();
    await signOut();
  };

  return (
    <Box>
      <ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
        <Popover
          isOpen={isMenuOpen}
          positions={['bottom']} // preferred positions
          padding={8} // space between the target and popover content
          containerStyle={{
            // backgroundColor: '#242526',
            boxShadow: '0 1px 1px rgba(0,0,0,.1)',
            border: '1px solid rgba(0, 0, 0, .14)'
          }} // custom styles for the popover content container
          content={
            <Paper sx={{ width: 200, maxWidth: '100%' }}>
              <MenuList dense>
                {Object.entries(userRoutes).map(([key, value]) => (
                  <MenuItem key={key} href={value}>
                    <ListItemIcon>
                      <Iconify icon={(icons as any)[key]} fontSize="small" sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText>{capitalCase(key)}</ListItemText>
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={handleSignOut}>
                  <ListItemIcon>
                    <Iconify icon={icons.logout} fontSize="small" sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </MenuList>
            </Paper>
          }
        >
          <IconButton onClick={() => setIsMenuOpen((prev) => !prev)}>
            <Avatar sx={{ width: 25, height: 25 }}>{username?.charAt(0) || 'U'}</Avatar>
            <Iconify icon="mdi:arrow-down-drop" fontSize="small" sx={{ color: 'white' }} />
          </IconButton>
        </Popover>
      </ClickAwayListener>
    </Box>
  );
};

export default ProfileDropdown;