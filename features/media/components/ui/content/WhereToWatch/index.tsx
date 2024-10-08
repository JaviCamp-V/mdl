// Server Component
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProviders } from '@/features/media/service/tmdbViewService';
import { Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import { blur_url } from '@/libs/common';

interface WhereToWatchProps extends MediaDetailsProps {
  containerStyle?: any;
  title: string;
}
const WhereToWatch: React.FC<WhereToWatchProps> = async ({ mediaId, mediaType, containerStyle, title }) => {
  const response = await getProviders(mediaType, mediaId);
  if (!response.results || !Object.keys(response.results).length) return;
  const providers = Object.values(response.results).flatMap((country) => {
    const flatrate = country?.flatrate?.map((rest) => ({ ...rest, action: 'Stream' })) ?? [];
    const buy = country.buy?.map((rest) => ({ ...rest, action: 'Purchase' })) ?? [];
    const rent = country.rent?.map((rest) => ({ ...rest, action: 'Subscription' })) ?? [];
    return [...flatrate, ...buy, ...rent];
  });
  const uniqueProviders = providers.reduce((acc, provider) => {
    if (!acc.find((p) => p.provider_id === provider.provider_id)) acc.push(provider);
    return acc;
  }, [] as any[]);

  if (!uniqueProviders.length) return <Box />;

  return (
    <Box sx={{ ...containerStyle, minHeight: 0, padding: 2.5 }}>
      <Typography
        fontSize={18}
        fontWeight={700}
        lineHeight={1}
        marginBottom={2}
      >{`Where to Watch ${title}`}</Typography>
      <Grid container spacing={2} sx={{ marginRight: 2 }}>
        {uniqueProviders
          .sort((a, b) => a.display_priority - b.display_priority)
          .slice(0, 9)
          .map((provider) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={provider.provider_id}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Paper
                elevation={2}
                sx={{ padding: 0 }}
                component={Image}
                src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
                blurDataURL={blur_url}
                width={60}
                height={60}
                alt={provider.provider_name}
                style={{ borderRadius: '50%', border: '1px solid rgba(0, 0, 0, .14)' }}
                priority
              />

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Link href="#" passHref style={{ textDecoration: 'none' }}>
                  <Typography fontSize={16} color="primary" fontWeight={700}>
                    {provider.provider_name}
                  </Typography>
                </Link>
                <Typography fontSize={14}>{provider.action}</Typography>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default WhereToWatch;
