'use server';

import { UploadApiOptions, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import logger from '@/utils/logger';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const deleteImage = async (userId: number): Promise<boolean> => {
  try {
    await cloudinary.uploader.destroy(`avatar-${userId}`, { resource_type: 'image' });
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

const uploadConfig: UploadApiOptions = {
  resource_type: 'image',
  folder: 'profile',
  timeout: +(process.env.CLOUDINARY_TIMEOUT ?? 3000)
};

const uploadImageV2 = async (imageData: FormData): Promise<string | null> => {
  const userId = imageData.get('userId');
  const file = imageData.get('file') as File;
  if (!userId || !file) {
    return null;
  }
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    logger.info('Uploading image to cloudinary...');
    const results = await new Promise<UploadApiResponse | null>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ ...uploadConfig, public_id: `avatar-${userId}` }, (error, response) => {
          if (error || response === undefined) {
            logger.error(error);
            reject(null);
            return;
          }
          logger.info('Image uploaded to cloudinary.');
          resolve(response);
        })
        .end(buffer);
    });
    return results ? results.secure_url : null;
  } catch (error) {
    logger.error(error);
    return null;
  }
};
export { uploadImageV2, deleteImage };
