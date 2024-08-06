'use server';

import React from 'react';
import { getCredits } from '@/server/tmdbActions';
import { MediaRequest } from '@/types/tmdb/IGenericRequest';
import CastOverview from './CastOverview';
import CrewSummary from './CrewSummary';
import FullCredits from './FullCredits';

interface CreditsProps extends MediaRequest {
  view: 'overview' | 'creator' | 'all';
}
const Credits: React.FC<CreditsProps> = async ({ id, mediaType, view }) => {
  const credits = await getCredits(mediaType, id);

  if (view === 'overview') return <CastOverview {...credits} type={mediaType} />;

  if (view === 'creator') return <CrewSummary {...credits} />;

  return <FullCredits {...credits} />;
};

export default Credits;
