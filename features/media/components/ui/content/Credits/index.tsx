'use server';

import React from 'react';
import { getCredits } from '@/features/media/service/tmdbViewService';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import CastOverview from './CastOverview';
import CrewSummary from './CrewSummary';
import FullCredits from './FullCredits';


interface CreditsProps extends MediaDetailsProps {
  view: 'overview' | 'creator' | 'all';
}
const Credits: React.FC<CreditsProps> = async ({ mediaId, mediaType, view }) => {
  const credits = await getCredits(mediaType, mediaId);

  if (view === 'overview') return <CastOverview {...credits} type={mediaType} />;

  if (view === 'creator') return <CrewSummary {...credits} />;

  return <FullCredits {...credits} />;
};

export default Credits;