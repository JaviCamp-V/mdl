import React from 'react';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import AddRecommendation from '../../forms/AddRec';

interface RecommendationDetailsProps extends MediaDetailsProps {}

const RecommendationDetails: React.FC<RecommendationDetailsProps> = async ({ mediaId, mediaType }) => {
  return <AddRecommendation mediaId={mediaId} mediaType={mediaType} />;
};

export default RecommendationDetails;
