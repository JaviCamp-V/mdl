import React from 'react';
import { getMediaSuggestions } from '@/features/recommendations/service/recommendationService';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import AddRecommendation from '../../forms/AddRec';
import AllRecommendations from '../AllRecs';
import RecommendationOverview from '../RecsOverview';

interface RecommendationDetailsProps extends MediaDetailsProps {
  section?: string;
}

const RecommendationDetails: React.FC<RecommendationDetailsProps> = async ({ mediaId, mediaType, section }) => {
  if (section && section === 'new') return <AddRecommendation mediaId={mediaId} mediaType={mediaType} />;

  const suggestions = await getMediaSuggestions(mediaType, mediaId);

  if (section && section === 'overview')
    return <RecommendationOverview mediaId={mediaId} mediaType={mediaType} suggestion={suggestions} />;

  return <AllRecommendations mediaId={mediaId} mediaType={mediaType} suggestions={suggestions} />;
};

export default RecommendationDetails;