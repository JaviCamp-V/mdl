import React from 'react';
import ContentCategoryDetail from '@/features/media/components/ui/content/CategoryDetails';
import ExternalID from '@/features/media/types/interfaces/ExternalID';
import Genre from '@/features/media/types/interfaces/Genre';
import Network from '@/features/media/types/interfaces/Network';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import MetaDetails from '../../MetaDetails';

interface DetailsCardProps extends MediaDetailsProps {
  external_ids: ExternalID;
  number_of_episodes: number;
  title: string;
  origin_country: string[];
  release_date: string | null | undefined;
  last_air_date: string | null | undefined;
  networks: Network[];
  runtime: number | number[];
  genres: Genre[];
  withCategory?: boolean;
}
const DetailsCard: React.FC<DetailsCardProps> = ({
  mediaId,
  mediaType,
  external_ids,
  number_of_episodes,
  title,
  origin_country,
  release_date,
  last_air_date,
  networks,
  runtime,
  genres,
  withCategory
}) => {
  return (
    <Box sx={{ boxShadow: '0 1px 1px rgba(0,0,0,.1)' }}>
      <Box
        sx={{
          backgroundColor: 'primary.main',
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          padding: 1,
          paddingLeft: 2
        }}
      >
        <Typography fontSize={18} fontWeight={700}>
          Details
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          padding: 2
        }}
      >
        <MetaDetails
          tvdb_id={external_ids.tvdb_id}
          imdb_id={external_ids.imdb_id}
          number_of_episodes={number_of_episodes}
          title={title}
          origin_country={origin_country}
          release_date={release_date}
          last_air_date={last_air_date}
          networks={networks}
          runtime={runtime}
          mediaType={mediaType}
          mediaId={mediaId}
        />
        {withCategory && <ContentCategoryDetail genres={genres} mediaType={mediaType} mediaId={mediaId} />}
      </Box>
    </Box>
  );
};

export default DetailsCard;
