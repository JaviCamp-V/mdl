import { getTranslations } from '@/server/tmdb2Actions';
import MediaType from '@/types/tmdb/IMediaType';
import React from 'react'
import TranslateOverview from './translateOverview';

type MediaOverviewProps = {
    id: number;
    type: MediaType.movie | MediaType.tv;
    overview: string;
}
const MediaOverview: React.FC<MediaOverviewProps> = async({id, type, overview}) => {
 const translations = await getTranslations(type, id);
 console.log(translations);
 if ( translations.length === 0) {
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
 }

  return <TranslateOverview translations={translations.filter(({data})=> data.overview)} />
}

export default MediaOverview