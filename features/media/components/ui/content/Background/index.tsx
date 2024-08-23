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
  const defaulTranslation = {
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
  };
  let newTranslations = [];
  if (translations.length === 0) {
    newTranslations = [defaulTranslation];
  }
  {
    const english = translations.find((translation) => translation.iso_639_1 === 'en') ?? defaulTranslation;
    const filteredAndSortedTranslations = translations
      .filter(
        (translation) => translation.iso_639_1 !== 'en' && translation.data.overview && translation.english_name?.trim()
      )
      .sort((a, b) => a.iso_639_1.localeCompare(b.iso_639_1));

    newTranslations = [english, ...filteredAndSortedTranslations];
  }
  return <LanguageSwitcher translations={newTranslations} />;
};

export default MediaBackground;
