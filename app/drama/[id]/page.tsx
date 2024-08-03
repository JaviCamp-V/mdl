import Countdown from '@/components/Countdown';
import Iconify from '@/components/Icon/Iconify';
import DramaPoster from '@/components/Poster';
import { getDetails } from '@/server/tmdbActions';
import { lookupShow } from '@/server/tvMazeActions';
import { Provider } from '@/types/drama/IDramaDetails';
import { createDate } from '@/utils/dateUtils';
import { formatTime } from '@/utils/formatters';
import { Box, Grid, Paper, Rating, Typography } from '@mui/material';
import { sentenceCase } from 'change-case';
import { Metadata, NextPage } from 'next/types';
import Image from 'next/image';
import Link from 'next/link';
import { object } from 'yup';
import MediaType from '@/types/tmdb/IMediaType';

type PageProps = {
  params: { id: number };
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DramaDetailsPage: NextPage<PageProps> = async ({ params: { id } }) => {
  const drama = await getDetails(id, true);
  if (!drama) {
    return <Typography>Not Found</Typography>;
  }


  const details = {
    drama: drama.name,
    country: drama.origin_country,
    episodes: drama.number_of_episodes,
    airs: `${drama.first_air_date} - ${drama.last_air_date}`,
    airsOn: days[new Date(drama.first_air_date).getDay()],
    originalNetwork: drama.networks.length > 0 ? drama.networks[0].name : 'Unknown',
    contentRating: 'Not Yet Rated'
  };
  const boxStyle = {
    marginTop: 4,
    backgroundColor: '#242526',
    borderRadius: 2,
    padding: 2,
    overflow: 'hidden'
  };

  let nextEpisode: {
    airsOn: Date;
    episode_number: number;
    number_of_episodes: number;
  } | null = null;
  if (drama.next_episode_to_air && drama.external_ids.tvdb_id !== null) {
    const response = await lookupShow(drama.external_ids.tvdb_id);
    const airTime = response?.schedule?.time ?? '';
    const timezone = response?.network?.country?.timezone ?? '';
    const airsOn = createDate(drama.next_episode_to_air.air_date, airTime, timezone);
    nextEpisode = {
      airsOn,
      episode_number: drama.next_episode_to_air.episode_number,
      number_of_episodes: drama.number_of_episodes
    };
  }

  const providers = Object.values(drama['watch/providers'].results).flatMap((country) => {
    const flatrate = country.flatrate ?? [];
    const ads = country.ads ?? [];
    return [...flatrate, ...ads];
  });
  const unqiueProviders = providers.reduce((acc, provider) => {
    if (!acc.find((p) => p.provider_id === provider.provider_id)) {
      acc.push(provider);
    }
    return acc;
  }, [] as Provider[]);
  
  const allPhotos = [...drama.images.posters, ...drama.images.logos,...drama.images.backdrops].map((image) => image.file_path);
  const photos= [...new Set(allPhotos) as any];
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Grid container spacing={3} sx={{ padding: 4 }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ backgroundColor: '#242526', borderRadius: 2, padding: 2, minHeight: '50vh', overflow: 'hidden' }}>
            <Typography fontSize={28} fontWeight={500} color="primary" paddingLeft={2}>
              {`${drama.name} (${new Date(drama.first_air_date).getFullYear()})`}
            </Typography>
            <Grid container spacing={3} padding={2}>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <DramaPoster src={drama.poster_path} width={200} height={300} id={id} mediaType={MediaType.tv} />
                  <Typography>Currently Watching</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={9}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, paddingY: 1 }}>
                  <Box
                    sx={{
                
                      width: '82px',
                      height: '82px',
                      borderRadius: 2,
                      backgroundColor: '#f2632a',
                      boxShadow: '0 1px 1px 0 rgba(0, 0, 0, .25)'
                    }}
                  >
                    <Typography color="#fff" fontSize={36} fontWeight={500} lineHeight={'78px'} textAlign={'center'}>
                      {drama.vote_average.toFixed(1)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, width: '70%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0, alignItems: 'center' }}>
                      <Typography fontSize={14} fontWeight={500}>
                        {' '}
                        Your Rating:
                      </Typography>
                      <Rating
                        name="read-only"
                        value={0}
                        precision={0.1}
                        readOnly
                  
                        sx={{ paddingX: 1 }}
                      />
                      <Typography fontSize={14} fontWeight={500}>
                        {' '}
                        0/10{' '}
                      </Typography>
                    </Box>
                    <Typography fontSize={14}>
                      {`Ratings: ${drama.vote_average.toFixed(1)}/10 from users`}
                    </Typography>
                    <Typography fontSize={14}>
                      {`# of Watchers: N/A`}
                    </Typography>
                    <Typography fontSize={14}>
                      {`Reviews: 4 users`}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography
                    fontSize={14}
                    whiteSpace="pre-line"
                    fontFamily="lato,Helvetica,Arial,sans-serif"
                    lineHeight={1.5}
                    sx={{ WebkitFontSmoothing: 'antialiased' }}
                  >
                    {drama.seasons[0].overview || drama.overview}
                  </Typography>
                  <Box>
                    <Typography fontSize={14} fontWeight={500}>
                      Native Title{' '}
                      <Typography component="span" fontSize={14} fontWeight={400}>
                        {drama.original_name}
                      </Typography>
                    </Typography>
                    <Typography fontSize={14} fontWeight={500}>
                      Also Known As:
                      <Typography component="span" fontSize={14} fontWeight={400} paddingLeft={1}>
                        {drama.alternative_titles.results
                          .map((title) => title.title)
                          .filter((title) => /^[a-zA-Z0-9\s.,!?'"-]*$/.test(title))
                          .join(', ')}
                      </Typography>
                    </Typography>
                    <Typography fontSize={14} fontWeight={500}>
                      Screenwriter:
                      <Typography component="span" fontSize={14} fontWeight={400} paddingLeft={1}>
                        {drama.aggregate_credits.crew
                          .filter((member) => member.department === 'Writing')
                          .map((member) => member.name)
                          .join(', ')}
                      </Typography>
                    </Typography>
                    <Typography fontSize={14} fontWeight={500}>
                      Director:
                      <Typography component="span" fontSize={14} fontWeight={400} paddingLeft={1}>
                        {drama.aggregate_credits.crew
                          .filter((member) => member.department === 'Directing')
                          .map((member) => member.name)
                          .join(', ')}
                      </Typography>
                    </Typography>
                    <Typography fontSize={14} fontWeight={500}>
                      Genres:
                      <Typography component="span" fontWeight={400} paddingLeft={1}>
                        {drama.genres.map((genre) => genre.name).join(', ')}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {nextEpisode && (
            <Box
              sx={{
                ...boxStyle,
                padding: 3,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <Iconify
                  icon="simple-line-icons:calender"
                  sx={{ color: '#1B92E4', fontSize: 48, width: 50, height: 50 }}
                />
                <Box>
                  <Typography color="#a1aac1" fontSize={16}>
                    {`Episode ${nextEpisode.episode_number} of ${nextEpisode.number_of_episodes} airing on`}
                  </Typography>
                  <Typography fontSize={16} fontWeight={500}>
                    {formatTime(nextEpisode.airsOn)}
                  </Typography>
                </Box>
              </Box>
              <Countdown date={nextEpisode.airsOn} />
            </Box>
          )}
          {!!unqiueProviders.length && (
            <Box sx={{ ...boxStyle }}>
              <Typography fontSize={18} fontWeight={500} lineHeight={1}>{`Where to Watch ${drama.name}`}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, overflow: 'hidden', marginTop: 2 }}>
                {unqiueProviders.sort((a, b)=> a.display_priority - b.display_priority).slice(0, 4).map((provider) => (
                  <Box
                    key={provider.provider_id}
                    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500/${provider.logo_path}`}
                      width={60}
                      height={60}
                      alt={provider.provider_name}
                      style={{ borderRadius: '50%' }}
                      priority
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Link href="#" passHref style={{ textDecoration: 'none' }}>
                        <Typography fontSize={16} color="#1675b6" fontWeight={700}>
                          {provider.provider_name}
                        </Typography>
                      </Link>
                      <Typography fontSize={14}>Subscription</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          <Box sx={{ ...boxStyle, paddingX: 0 }}>
            <Typography paddingX={2} fontSize={18} fontWeight={500} lineHeight={1}>
              {' '}
              Cast & Credits
            </Typography>
            <Box
              sx={{
                borderTop: '1px solid hsla(210, 8%, 51%, .13)',
                borderBottom: '1px solid hsla(210, 8%, 51%, .13)',
                padding: 2,
                marginTop: 2
              }}
            >
              <Grid container spacing={2}>
                {[...drama.aggregate_credits.cast].slice(0, 6).map((member) => (
                  <Grid item xs={12} sm={4} key={member.id} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                    <Box sx={{ flexBasis: '40%' }}>
                      <Image
                        src={`https://image.tmdb.org/t/p/w500/${member.profile_path}`}
                        alt={member.name}
                        width={500}
                        height={300}
                        sizes="100vw"
                        priority
                        style={{ borderRadius: '5px', objectFit: 'contain', width: '100%', height: 'auto' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%' }}>
                      <Link href="#" passHref style={{ textDecoration: 'none' }}>
                        <Typography fontSize={16} color="#1675b6" fontWeight={700}>
                          {member.name}
                        </Typography>
                      </Link>
                      <Typography fontSize={14}>
                        {member.roles?.map((role) => role.character).join(',') || 'Unknown Role'}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Link href="#" style={{ textDecoration: 'none', paddingLeft: 2 }} passHref>
              <Typography fontSize={16} color="#1675b6" textAlign={'center'}>
                {`View all (${drama.aggregate_credits.cast.length + drama.aggregate_credits.crew.length})`}
              </Typography>
            </Link>
          </Box>
          <Box sx={boxStyle}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography fontSize={18} fontWeight={500} lineHeight={1}>
                Photos
              </Typography>
              <Link href="#" style={{ textDecoration: 'none' }} passHref>
                <Typography fontSize={16} color="#1675b6" textAlign={'center'}>
                  {`View all (${photos.length})`}
                </Typography>
              </Link>
            </Box>
            <Grid container spacing={2} marginTop={1}>
              {photos.slice(0, 6).map((photo) => (
                <Grid item key={photo} xs={4} sm={2}>
                  <Box sx={{ width: '120px', height: '150px', position: 'relative' }}>
                    <Image
                      src={`https://image.tmdb.org/t/p/original${photo}}`}
                      alt={'photo'}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority
                    ></Image>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box sx={boxStyle}>Review</Box>
          <Box sx={boxStyle}>Recommendations</Box>
          <Box sx={boxStyle}>Discussion</Box>
          <Box sx={boxStyle}>Comments</Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              boxShadow: '0 1px 1px rgba(0,0,0,.1)',
              border: '1px solid rgba(0,0,0,.14)'
            }}
          >
            <Box sx={{ boxShadow: '0 1px 1px rgba(0,0,0,.1)' }}>
              <Box
                sx={{
                  backgroundColor: '#00568C',
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                  padding: 2,
                  color: '#fff'
                }}
              >
                <Typography fontSize={18} fontWeight={500}>
                  Details
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: '#1B1C1D',
                  borderBottomLeftRadius: 2,
                  borderBottomRightRadius: 2,
                  padding: 2
                }}
              >
                {Object.entries(details).map(([key, value]) => (
                  <Typography fontSize={14} key={key}>
                    {sentenceCase(key)}: {value}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DramaDetailsPage;
