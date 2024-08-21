import React from 'react';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

interface NotificationsAlertProps {
  notificationCount?: number;
}
const NotificationsAlert: React.FC<NotificationsAlertProps> = ({ notificationCount = 0 }) => {
  return (
    <IconButton sx={{ margin: 0 }}>
      <Badge badgeContent={notificationCount} color="primary" sx={{ margin: 0 }}>
        <NotificationsNoneOutlinedIcon sx={{ color: '#fff' }} />
      </Badge>
    </IconButton>
  );
};

export default NotificationsAlert;
