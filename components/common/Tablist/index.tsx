import React from 'react';
import { Box, SxProps, Tabs, Typography } from '@mui/material';
import Link from '../Link';
import LinkTab from '../NavTab';

interface TabsListProps {
  baseUrl: string;
  activeTab: string | undefined;
  tabs: { label: string; href: string; sx?: SxProps; absolute?: boolean }[];
}
const TabsList: React.FC<TabsListProps> = ({ tabs, activeTab, baseUrl }) => {
  return (
    <Tabs
      value={tabs.findIndex((tab) => tab.href === activeTab)}
      sx={{
        width: '100%',
        display: 'flex',
        borderBottom: '1px solid #3e4042',
        '& .MuiTabs-flexContainer': {
          flexWrap: 'wrap',
          justifyContent: 'left',
          alignItems: 'flex-start'
        }
      }}
      TabIndicatorProps={{
        sx: {
          display: 'none'
        }
      }}
    >
      {tabs.map((tab) => (
        <LinkTab
          key={tab.label}
          label={tab.label}
          href={ tab?.absolute ? tab.href :`/${baseUrl}/${tab.href}`}
          selected={tab.href === activeTab}
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
            fontSize: 15,
            fontWeight: tab.href === activeTab ? 700 : 400,
            borderBottom: tab.href === activeTab ? '1px solid #1675b6' : 'none',
            '&:hover': {
              borderBottom: tab.href === activeTab ? '1px solid #1675b6' : '1px solid #3e4042'
            },
            ...tab?.sx
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabsList;
