'use client';

import React from 'react';
import Link from 'next/link';
import { TVSearchResult } from '@/features/media/types/interfaces/SearchResponse';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Typography } from '@mui/material';
import Tab from '@mui/material/Tab';
import routes from '@/libs/routes';
import DramaList from '../../DramaList';

export interface AiringData {
  code: string;
  dramas: TVSearchResult[];
  name: string;
}

interface TopAiringResultsProps {
  data: AiringData[];
}

const TopAiringResults: React.FC<TopAiringResultsProps> = ({ data }) => {
  const [value, setValue] = React.useState(data[0].code);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingX: 2,
          alignItems: 'center',
          marginBottom: 1
        }}
      >
        <Typography fontSize={18} fontWeight={700}>
          Top Airing
        </Typography>
        <Link href={`${routes.discoverAiring}?country=${value}`} style={{ textDecoration: 'none' }}>
          <Typography fontSize={14} color="text.primary">
            View All
          </Typography>
        </Link>
      </Box>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ sx: { display: 'none' } }}
            sx={{
              borderTop: '1px solid hsla(210, 8%, 51%, .13)',
              borderBottom: '1px solid hsla(210, 8%, 51%, .13)'
            }}
          >
            {data.map((country) => (
              <Tab key={country.code} label={country.name} value={country.code} sx={{ textTransform: 'capitalize' }} />
            ))}
          </TabList>
        </Box>
        {data.map((country) => (
          <TabPanel key={country.code} value={country.code} sx={{ paddingX: 0, paddingY: 1 }}>
            <DramaList dramas={country.dramas} />
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default TopAiringResults;
