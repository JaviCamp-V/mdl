import React from 'react';
import { Metadata, NextPage } from 'next';
import Link from 'next/link';
import columns from '@/features/watchlist/components/tables/watchlist/columns';
import { capitalCase } from 'change-case';
import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { getUserWatchlist } from '@/server/watchlistActions';
import Table from '@/components/common/Table';
import MediaType from '@/types/tmdb/IMediaType';
import { WatchlistItems } from '@/types/watchlist/IGeneralWatchlistRecord';
import WatchStatus from '@/types/watchlist/WatchStatus';
import { getSession } from '@/utils/authUtils';
import routes from '@/libs/routes';


type PageProps = {
  params: { username: string };
  searchParams: { [status: string]: string };
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { username } = params;
  return {
    title: `${username}'s Watchlist`
  };
};

const WatchlistPage: NextPage<PageProps> = async ({ params: { username }, searchParams: { status } }) => {
  const response = await getUserWatchlist(username);
  const session = await getSession();
  const isOwner = session?.user?.username === username;
  const all = 'allDramasAndFilms';
  const sections = Object.values(WatchStatus).reduce(
    (acc, status) => {
      const items = response.filter((item) => item.watchStatus === status);
      return { ...acc, [status.toLowerCase()]: items };
    },
    {} as { [status: string]: WatchlistItems[] }
  );

  const summaryFunctions = {
    dramas: (items: WatchlistItems[]) => items.filter((item) => item.mediaType.toLowerCase() === MediaType.tv).length,
    episodes: (items: WatchlistItems[]) => items.reduce((acc, item) => acc + item.episodeWatched, 0),
    movies: (items: WatchlistItems[]) =>
      items.filter((item) => item.mediaType.toLowerCase() === MediaType.movie).length,
    days: (items: WatchlistItems[]) => (items.reduce((acc, item) => acc + item.runtime, 0) / 1440).toFixed(2)
  };

  const getBackgroundColor = (watchStatus: string) => {
    if (!status && watchStatus === all) return '#FFF';
    if (watchStatus === status) return '#FFF';
    return 'primary.main';
  };

  const getColor = (watchStatus: string) => {
    if (!status && watchStatus === all) return 'info.main';
    if (watchStatus === status) return 'info.main';
    return '#FFF';
  };
  return (
    <Box sx={{ padding: { xs: 0, md: 4 }, marginX: { xs: 2, lg: 8 }, backgroundColor: 'background.default' }}>
      <Typography fontSize={20} fontWeight={700} marginBottom={2}>
        {`Welcome to `}
        <Typography
          color="primary"
          component={Link}
          href={routes.user.profile.replace('{username}', username)}
          fontWeight={700}
          fontSize={20}
          sx={{ textDecoration: 'none' }}
          passHref
        >
          {username}{' '}
        </Typography>
        {`'s Watchlist`}
      </Typography>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'rows',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: 'primary.main'
        }}
      >
        {[all, ...Object.keys(sections)].map((watchStatus) => (
          <Box
            component={Link}
            key={watchStatus}
            href={`${routes.user.watchlist.replace('{username}', username)}${watchStatus === all ? '' : `?status=${watchStatus}`}`}
            sx={{
              flex: 1,
              backgroundColor: getBackgroundColor(watchStatus),
              padding: 1,
              textDecoration: 'none',
              color: getColor(watchStatus)
            }}
            // passHref
          >
            <Typography fontSize={15} color="info">
              {capitalCase(watchStatus)}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <FormControl fullWidth>
          <Select
            value={status ?? all}
            sx={{
              '& .MuiSelect-select': {
                backgroundColor: 'background.paper',
                color: '#fff!important',
                borderColor: 'info.main',
                fontSize: '15px'
              },
              '& input': {
                '&:-webkit-autofill': {
                  WebkitBoxShadow: `0 0 0 1000px info.main inset`,
                  WebkitTextFillColor: 'info.contrastText'
                }
              },
              '& .MuiSelect-icon': {
                color: 'info.contrastText'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'background.paper'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'background.paper'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'background.paper'
              }
            }}
          >
            {[all, ...Object.keys(sections)].map((watchStatus) => (
              <MenuItem
                key={watchStatus}
                value={watchStatus}
                sx={{
                  flex: 1,
                  padding: 1,
                  textDecoration: 'none',
                  color: `info.main`,
                  '&.Mui-selected': {
                    backgroundColor: '#FFF'
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#FFF'
                  }
                }}
              >
                <Link
                  href={`${routes.user.watchlist.replace('{username}', username)}${watchStatus === all ? '' : `?status=${watchStatus}`}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Typography
                    fontSize={14}
                    sx={{ color: `${getColor(watchStatus)}!important`, textDecoration: 'none' }}
                  >
                    {capitalCase(watchStatus)}
                  </Typography>
                </Link>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
        {Object.entries(!status ? sections : { [status]: sections[status] }).map(([watchStatus, items], index) => (
          <Box
            key={watchStatus}
            sx={{
              backgroundColor: 'background.paper',
              paddingY: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Typography fontSize={16} fontWeight={700} paddingX={2}>
              {capitalCase(watchStatus)}
            </Typography>
            <Table
              columns={columns}
              filterColumns={!isOwner ? ['edit'] : []}
              rows={items}
              emptyMessage="You currently have no shows or movies on your list."
              headStyles={{ backgroundColor: 'primary.main' }}
              cellStyles={{
                paddingX: 2,
                paddingY: 0.5,
                fontSize: 14,
                width: 'min-width!important',
                textAlign: 'center'
              }}
            />
            <Box
              sx={{
                paddingX: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'left',
                gap: 0.5
              }}
            >
              {Object.entries(summaryFunctions).map(([key, func]) => (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    border: '1px solid info.main',
                    backgroundColor: 'background.default',
                    borderRadius: '4px',
                    paddingX: 1,
                    paddingY: 0.5,
                    gap: 1
                  }}
                >
                  <Typography sx={{ textTransform: 'uppercase', fontSize: '11px' }}>{key}</Typography>
                  <Box
                    sx={{
                      backgroundColor: 'background.paper',
                      paddingX: 0.4,
                      paddingY: 0.2,
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography fontSize={11} fontWeight={700}>
                      {items.length ? func(items) : 0}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WatchlistPage;