'use server';

import React from 'react';
import { getTranslations } from '@/features/media/service/tmdbService';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import LanguageSwitcher from './LanguageSwitcher';

interface MediaOverviewProps extends MediaDetailsProps {
  overview: string;
}
const MediaBackground: React.FC<MediaOverviewProps> = async ({ mediaId, mediaType, overview }) => {
  const translations = await getTranslations(mediaType, mediaId);
  if (translations.length === 0)
    translations.push({
      iso_3166_1: 'en',
      iso_639_1: 'en',
      name: 'English',
      data: {
        overview: overview || 'No overview found',
        name: '',
        homepage: '',
        tagline: ''
      },
      english_name: 'English'
    });

  return (
    <LanguageSwitcher
      translations={translations
        .filter(({ data }) => data.overview)
        .sort((a, b) => a.iso_639_1.localeCompare(b.iso_639_1))}
    />
  );
};

export default MediaBackground;
