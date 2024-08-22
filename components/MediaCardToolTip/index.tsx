import React from 'react';
import Genre from '@/features/media/types/interfaces/Genre';
import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import MediaType from '@/types/enums/IMediaType';
import countries from '@/libs/countries';
import DramaPoster from '../Poster';
import Ratings from '../common/Ratings';

interface MediaCardProps {
  id: number;
  title: string;
  year: number;
  mediaType: MediaType.tv | MediaType.movie;
  originalTitle: string;
  country: string;
  voteAverage: number;
  overview: string;
  posterPath: string | null;
  genres: Genre[];
  tooltipProps?: any;
}

interface MediaCardToolTipProps extends MediaCardProps {
  children: any;
}

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    placement="right"
    {...props}
    classes={{ popper: className }}
    enterTouchDelay={1000}
    leaveDelay={0}
    arrow
    slotProps={{
      popper: {
        sx: {
          [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]: {
            marginTop: 2
          },
          [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]: {
            marginBottom: 2
          },
          [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]: {
            marginLeft: 2
          },
          [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]: {
            marginRight: 2
          }
        }
        // modifiers: [
        //   {
        //     name: 'offset',
        //     options: {
        //       offset: [20, 0]
        //     }
        //   }
        // ]
      }
    }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: theme.breakpoints.values.sm - 100,
    padding: 0,
    margin: 0,
    width: '100%',
    borderRadius: 2,
    backgroundColor: 'transparent'
  }
}));
const MediaCard: React.FC<MediaCardProps> = ({
  title,
  year,
  originalTitle,
  country,
  mediaType,
  posterPath,
  id,
  voteAverage,
  overview,
  genres
}) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        boxShadow: '0 1px 1px rgba(0,0,0,.1)',
        border: '1px solid #3e4042',
        width: '100%',
        borderRadius: '4px',
        padding: 0,
        paddingBottom: 2,
        margin: 0
      }}
    >
      <Grid container spacing={1.5} sx={{ width: '100%', margin: 0, paddingY: 0, paddingX: 0.5 }}>
        <Grid item xs={12} sm={12} sx={{ padding: 0, margin: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
            <Typography fontSize={18} color="primary">
              {title}
            </Typography>
            <Typography fontSize={18}>{year}</Typography>
          </Box>
          <Typography fontSize={14}>
            {`${originalTitle} (${countries.find((c) => c.code === country)?.nationality} ${mediaType.toLowerCase() === 'tv' ? 'Drama' : 'Movie'})`}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ width: '100%', height: '25vh' }}>
            <DramaPoster src={posterPath} id={id} mediaType={mediaType} size="w342" />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={9}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            justifyContent: 'left',
            alignItems: 'flex-start',
            width: '100%'
          }}
        >
          <Ratings rating={voteAverage} showText />
          <Typography
            fontSize={14}
            whiteSpace="pre-line"
            lineHeight={1.5}
            sx={{
              WebkitFontSmoothing: 'antialiased',
              whiteSpace: 'pre-line',
              overflow: 'hidden',
              fontSize: 14,
              lineHeight: 1.5,
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: { xs: 4, md: 3 },
              lineClamp: { xs: 4, md: 3 },
              marginRight: 1
            }}
          >
            {overview}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
            {genres.slice(0, 3).map((genre) => (
              <Box
                key={genre.id}
                sx={{
                  backgroundColor: 'info.main',
                  border: '1px solid #fff',
                  borderColor: 'info.contrastText',
                  padding: 0.5,
                  borderRadius: '4px'
                }}
              >
                <Typography fontSize={13} sx={{ color: 'info.contrastText' }}>
                  {genre.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const MediaCardToolTip: React.FC<MediaCardToolTipProps> = ({ children, tooltipProps, ...props }) => {
  return (
    <CustomWidthTooltip
      {...tooltipProps}
      sx={{
        display: {
          xs: 'none', // Hide tooltip on mobile
          sm: 'inline' // Show tooltip on larger screens
        }
      }}
      title={<MediaCard {...props} />}
    >
      {children}
    </CustomWidthTooltip>
  );
};

export default MediaCardToolTip;