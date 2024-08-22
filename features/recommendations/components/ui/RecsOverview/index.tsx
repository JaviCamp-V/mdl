import React from 'react';
import { Suggestion } from '@/features/recommendations/types/interface/Suggestion';
import NoReviews from '@/features/reviews/components/ui/NoReview';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@/components/common/Divider';
import Link from '@/components/common/Link';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import SuggestionCard from '../../cards/SuggestionCard';
import NoRecommendation from '../NoRec';

interface RecommendationOverviewProps extends MediaDetailsProps {
  suggestion: Suggestion[];
}
const RecommendationOverview: React.FC<RecommendationOverviewProps> = ({ mediaId, mediaType, suggestion }) => {
  return (
    <Box sx={{ paddingY: 2 }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          paddingX: 2,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Typography fontSize={16} fontWeight={700} lineHeight={1}>
          Recommendation
        </Typography>
        <Link
          href={`/${mediaType}/${mediaId}/recommendations/new`}
          sx={{ fontSize: 13, color: '#1675b6', textAlign: 'center' }}
        >
          Add Recommendation
        </Link>
      </Box>
      <Divider />
      {suggestion.length === 0 ? (
        <NoRecommendation mediaId={mediaId} mediaType={mediaType} />
      ) : (
        <React.Fragment>
          <Grid
            container
            spacing={2}
            sx={{ paddingX: 2 }}
            // sx={{ borderRight: '1px solid hsla(210,8%,51%,.13)', borderLeft: '1px solid hsla(210,8%,51%,.13)' }}
          >
            {suggestion.slice(0, 6).map((rec, index: number, arr) => (
              <Grid item xs={4} lg={2} key={`${rec.mediaId}-${rec.mediaType}`}>
                <SuggestionCard suggestion={rec} />
              </Grid>
            ))}
          </Grid>
          <Divider />
          <Box paddingX={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link href={`/${mediaType}/${mediaId}/recommendations`}>View all</Link>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

export default RecommendationOverview;
