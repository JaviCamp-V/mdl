'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/features/auth/services/authService';
import { capitalCase } from 'change-case';
import { signOut } from 'next-auth/react';
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Iconify from '@/components/Icon/Iconify';
import Avatar from '@/components/common/Avatar';
import { userRoutes } from '@/libs/routes';

interface ProfileDropdownProps {
  username: string;
  avatarUrl?: string;
}

const icons = {
  profile: 'mdi:user-circle-outline',
  watchlist: 'mdi:view-list-outline',
  custom_lists: 'mdi:format-list-numbered',
  settings: 'mdi:mixer-settings-vertical',
  logout: 'mdi:logout'
};
const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ username, avatarUrl }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (anchorEl !== event.currentTarget) setAnchorEl(event.currentTarget);
  };

  const router = useRouter();
  const handleSignOut = async () => {
    await logout();
    await signOut({ redirect: false });
  };

  const handleMenuItemClick = (href: string) => {
    router.push(href?.replace('{username}', username));
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? 'true' : undefined}
        sx={{ margin: 0, padding: 0 }}
      >
        <Avatar sx={{ width: 30, height: 30 }} username={username ?? 'U'} src={avatarUrl} />
        <Iconify icon="mdi:arrow-down-drop" fontSize="small" sx={{ color: 'white' }} />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose, dense: true }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              mt: 2,
              backgroundColor: 'background.paper',
              boxShadow: '0 1px 1px rgba(0,0,0,.1)',
              border: '1px solid rgba(0, 0, 0, .14)',
              width: 200,
              maxWidth: '100%'
            }
          }
        }}
      >
        {Object.entries(userRoutes).map(([key, value]) => (
          <MenuItem key={key} onClick={() => handleMenuItemClick(value)}>
            <ListItemIcon>
              <Iconify icon={(icons as any)[key]} fontSize="small" sx={{ color: 'text.primary' }} />
            </ListItemIcon>
            <ListItemText>{capitalCase(key)}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Iconify icon={icons.logout} fontSize="small" sx={{ color: 'text.primary' }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileDropdown;
