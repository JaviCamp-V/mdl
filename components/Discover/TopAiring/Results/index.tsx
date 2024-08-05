'use client';
import { Box, Rating, Tabs, Typography } from '@mui/material';
import Link from 'next/link';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import React from 'react';
import { color } from '@/libs/common';
import { TVSearchResult } from '@/types/tmdb/ISearchResposne';
import DramaCard from '@/components/DramaCard';
import DramaPoster from '@/components/Poster';
import MediaType from '@/types/tmdb/IMediaType';
import MediaTitle from '@/components/MediaTitle';
import { getOrigin } from '@/utils/tmdbUtils';
import DramaList from '@/components/DramaList';
import routes from '@/libs/routes';

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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', paddingX: 2, alignItems: 'center', marginBottom: 1 }}
      >
        <Typography color={color} fontSize={18} fontWeight={500}>
          Top Airing
        </Typography>
        <Link href={`${routes.discoverAiring}?country=${value}`} style={{ textDecoration: 'none' }}>
          <Typography color={color} fontSize={14}>
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
            sx={{ borderTop: '1px solid hsla(210, 8%, 51%, .13)', borderBottom: '1px solid hsla(210, 8%, 51%, .13)' }}
          >
            {data.map((country) => (
              <Tab
                key={country.code}
                label={country.name}
                value={country.code}
                sx={{ color, textTransform: 'capitalize' }}
              />
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
