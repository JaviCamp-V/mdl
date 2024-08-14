import React from 'react';
import { getVideos } from '@/server/tmdbActions';
import MediaType from '@/types/tmdb/IMediaType';
import PlayButton from './PlayButton';

interface WatchVideosProps {
  id: number;
  mediaType: MediaType.movie | MediaType.tv;
  trailerOnly?: boolean;
}

const WatchVideos: React.FC<WatchVideosProps> = async ({ id, mediaType, trailerOnly }) => {
  const response = await getVideos(mediaType, id);
  const trailer = response.results.find((video) => video.type === 'Trailer' && video.site === 'YouTube');
  const teaser = response.results.find((video) => video.type === 'Teaser' && video.site === 'YouTube');
  const videos = trailerOnly ? [trailer] : [trailer, teaser];

  const filteredVideos = videos.filter((video) => video);
  if (filteredVideos.length === 0) return null;

  return (
    <React.Fragment>
      {filteredVideos.map((video) => (
        <PlayButton video={video!} key={video!.id} />
      ))}
    </React.Fragment>
  );
};

export default WatchVideos;
