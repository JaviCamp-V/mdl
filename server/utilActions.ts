'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
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

const setTheme = async (theme: 'light' | 'dark') => {
  cookies().set('theme', theme);
  return { success: true };
};

export { refreshPage, setTheme };
