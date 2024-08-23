import ImageType from '../enums/ImageType';

export type BackDropType = 'w300' | 'w780' | 'w1280' | 'original';
export type LogoType = 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original';
export type PosterType = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type ProfileType = 'w45' | 'w185' | 'h632' | 'original';
export type StillType = 'w92' | 'w185' | 'w300' | 'original';

export type ImageSizes = {
  [ImageType.backdrop]: BackDropType;
  [ImageType.logo]: LogoType;
  [ImageType.poster]: PosterType;
  [ImageType.profile]: ProfileType;
  [ImageType.still]: StillType;
};
