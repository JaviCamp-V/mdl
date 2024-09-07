import React from 'react';
import MediaTitleRecord from '@/features/media/components/typography/TitleWithRecord';
import { RecommendationDetails } from '@/features/recommendations/types/interface/Recommendation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RecommendationCard from '../RecCard';
import SuggestionCard from '../SuggestionCard';

interface RecDetailsProps {
  recommendation: RecommendationDetails;
}

const RecommendationDetailsCard: React.FC<RecDetailsProps> = ({ recommendation }) => {
  const { source, suggested, reason, numberOfLikes, hasUserLiked } = recommendation;
  return (
    <Box id={recommendation.id.toString()} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginX: 2,
          gap: 2,
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        {Object.entries({ source, suggested }).map(([key, matchMedia]) => (
          <Box
            key={key}
            sx={{
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'row',
              // flexWrap: 'wrap',
              gap: 2,
              // justifyContent: 'center',
              alignItems: 'center',
              width: '50%'
            }}
          >
            <Box sx={{ width: '30%', overflow: 'hidden' }}>
              <SuggestionCard content={matchMedia} />
            </Box>

            <Box sx={{ width: '70%', overflow: 'hidden' }}>
              <Typography sx={{ fontSize: 14, opacity: 0.8 }}>
                {key === 'source' ? 'If you liked' : 'You might like'}
              </Typography>
              <MediaTitleRecord
                title={matchMedia.title}
                mediaType={matchMedia.mediaType}
                mediaId={matchMedia.mediaId}
                recordId={matchMedia.recordId}
                showEditButton
                fontSize={14}
                fontWeight={'bolder'}
                whiteSpace={'pre-wrap'}
              />
            </Box>
          </Box>
        ))}
      </Box>
      <RecommendationCard
        hasUserLiked={hasUserLiked}
        numberOfLikes={numberOfLikes}
        recommendationID={recommendation.id}
        createdAt={recommendation.createdAt}
        reason={reason}
      />
    </Box>
  );
};

export default RecommendationDetailsCard;
