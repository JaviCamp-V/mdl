import logger from "@/utils/logger";
import { revalidatePath } from "next/cache"


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