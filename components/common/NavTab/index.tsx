import Link from 'next/link';
import { SxProps } from '@mui/material';
import Tab from '@mui/material/Tab';

interface LinkTabProps {
  label?: string;
  href: string;
  selected?: boolean;
  sx?: SxProps;
}

const LinkTab: React.FC<LinkTabProps> = (props) => {
  return <Tab component={Link} aria-current={props.selected && 'page'} {...props} passHref />;
};

export default LinkTab;
