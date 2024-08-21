'use server';

import React from 'react';
import PlayButton from '@/features/media/components/buttons/PlayButton';
import { getVideos } from '@/features/media/service/tmdbService';
import VideoType from '@/features/media/types/enums/VideoType';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';

const WatchButtons: React.FC<MediaDetailsProps> = async ({ mediaId, mediaType }) => {
  const response = await getVideos(mediaType, mediaId);
  const trailer = response.results.find((video) => video.type === VideoType.Trailer && video.site === 'YouTube');
  const teaser = response.results.find((video) => video.type == VideoType.Teaser && video.site === 'YouTube');
  const videos = [trailer, teaser];

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

export default WatchButtons;
