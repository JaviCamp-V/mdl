import { Icon, IconifyIcon } from '@iconify/react';
import Box, { BoxProps } from '@mui/material/Box';


export interface IconifyProps extends BoxProps {
  icon: IconifyIcon | string;
}

const Iconify: React.FC<IconifyProps> = ({ icon, width = 20, sx, ...other }) => (
  <Box component={Icon} className="component-iconify" icon={icon} sx={{ width, height: width, ...sx }} {...other} />
);

export default Iconify;