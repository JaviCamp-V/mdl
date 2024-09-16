import { Accept } from 'react-dropzone';

export type RHFAllowedFileTypes = 'image' | 'video' | 'audio' | 'document';

const acceptTypesMap = {
  image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/mkv', 'video/avi'],
  audio: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  document: ['application/pdf', 'application/msword', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint']
};

const mimeTypesExtMap = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/jpg': ['.jpeg', '.jpg'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'video/mp4': ['.mp4'],
  'video/mkv': ['.mkv'],
  'video/avi': ['.avi'],
  'audio/mp3': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc', '.docx'],
  'application/vnd.ms-excel': ['.xls', '.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt', '.pptx']
};

const getExpectedFileTypes = (acceptTypes: RHFAllowedFileTypes[]): Accept =>
  acceptTypes.reduce((acc, type) => {
    const mimeType = acceptTypesMap[type];
    const mapping = mimeType.reduce((mimeTypes, mimeType) => {
      return { ...mimeTypes, [mimeType]: (mimeTypesExtMap as any)[mimeType] };
    }, {});

    return { ...acc, ...mapping };
  }, {} as Accept);

export { getExpectedFileTypes };