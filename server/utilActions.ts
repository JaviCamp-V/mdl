import { revalidatePath } from 'next/cache';
import logger from '@/utils/logger';

const refreshPage = async (path: string) => {
  logger.info(`Refreshing page data: ${path}`);
  return new Promise<void>((resolve, reject) => {
    try {
      revalidatePath(path);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export { refreshPage };
