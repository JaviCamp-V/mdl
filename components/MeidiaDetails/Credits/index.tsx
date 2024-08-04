import { getCredits } from '@/server/tmdb2Actions';
import { MediaRequest } from '@/types/tmdb/IGenericRequest'
import React from 'react'
import CastOverview from './CastOverview';
import FullCredits from './FullCredits';
import CrewSummary from './CrewSummary';

interface CreditsProps extends MediaRequest {
   view: 'overview' | 'creator' | 'all'
}
const Credits:React.FC<CreditsProps> = async ({id, mediaType, view}) => {
  const credits = await getCredits(mediaType, id);
  
  if (view === "overview") return <CastOverview {...credits} type={mediaType} />

  if (view === "creator") return <CrewSummary {...credits} />

  return <FullCredits {...credits} />
}

export default Credits