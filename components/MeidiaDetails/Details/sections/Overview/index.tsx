'use server';

import React from 'react';
import { getTranslations } from '@/server/tmdbActions';
import MediaType from '@/types/tmdb/IMediaType';
import TranslateOverview from './translateOverview';

type MediaOverviewProps = {
  id: number;
  type: MediaType.movie | MediaType.tv;
  overview: string;
};
const MediaOverview: React.FC<MediaOverviewProps> = async ({ id, type, overview }) => {
  const translations = await getTranslations(type, id);
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
    <TranslateOverview
      translations={translations
        .filter(({ data }) => data.overview)
        .sort((a, b) => a.iso_639_1.localeCompare(b.iso_639_1))}
    />
  );
};

export default MediaOverview;
