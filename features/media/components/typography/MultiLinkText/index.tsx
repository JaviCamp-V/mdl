import React from 'react';
import { capitalCase } from 'change-case';
import Typography from '@mui/material/Typography';
import Link from '@/components/common/Link';

interface MultiLinkTextProps {
  links: { label: string; href: string }[];
}
const MultiLinkText: React.FC<MultiLinkTextProps> = ({ links }) => {
  if (!links?.length) return 'N/A';
  return (
    <React.Fragment>
      {links.map((link, index, arr) => (
        <React.Fragment key={link.label}>
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
          {index < arr.length - 1 && <Typography sx={{ marginRight: 0.2 }}>,</Typography>}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default MultiLinkText;
