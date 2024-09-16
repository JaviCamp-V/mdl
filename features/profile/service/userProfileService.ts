'use server';

import { revalidateTag, unstable_cache } from 'next/cache';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import UserSummary from '@/types/common/UserSummary';
import { getServerActionSession } from '@/utils/authUtils';
import { generateErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';
import ProfileData from '../types/interfaces/ProfileData';
import UpdateProfile from '../types/interfaces/UpdateProfile';
import { deleteImage, uploadImageV2 } from './cloundairyService';


const endpoints = {
  user: {
    updateProfile: 'user/profile'
  },
  public: {
    getProfileById: 'profile/:userId',
    getProfileByUsername: 'profile/username/:username'
  }
};

const getUserProfileById = async (userId: number): Promise<ProfileData | null> => {
  logger.info('Fetching user %s profile data', userId);
  const endpoint = endpoints.public.getProfileById.replace(':userId', userId.toString());
  const response = await mdlApiClient.get<ProfileData>(endpoint);
  return response;
};
const getUserProfile = async (username: string): Promise<ProfileData | null> => {
  logger.info('Fetching user %s profile data', username);
  const endpoint = endpoints.public.getProfileByUsername.replace(':username', username);
  return await mdlApiClient.get<ProfileData>(endpoint);
};

const cachedGetUserProfileById = async (userId: number): Promise<ProfileData | null> => {
  try {
    const getCached = unstable_cache(getUserProfileById, [userId.toString()], {
      tags: [`user-profile-${userId}`]
    });
    return await getCached(userId);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    logger.error('Error fetching user profile data: %s', message);
    return null;
  }
};
const cachedGetUserProfileByUsername = async (username: string): Promise<ProfileData | null> => {
  try {
    const getCached = unstable_cache(getUserProfile, [username], {
      tags: [`user-profile-${username}`]
    });
    return await getCached(username);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    logger.error('Error fetching user profile data: %s', message);

    return null;
  }
};

const getAuthUserProfile = async (): Promise<ProfileData | null> => {
  try {
    const session = await getServerActionSession();

    const userId = session?.user?.userId;
    if (!userId) return null;
    const response = await cachedGetUserProfileById(userId);
    return response;
  } catch (error: any) {
    logger.error('Error fetching user profile data: %s', error.message);
    return null;
  }
};

const getUserSummary = async (userId: number): Promise<UserSummary> => {
  try {
    const response = await cachedGetUserProfileById(userId);
    if (!response) return { id: userId, enabled: false, username: 'Unknown', displayName: 'Unknown', avatarUrl: null };
    const { id, username, displayName, avatarUrl, enabled } = response;
    return { id, username, displayName, avatarUrl, enabled };
  } catch (error: any) {
    logger.error('Error fetching user summary data: %s', error.message);
    return { id: userId, enabled: false, username: 'Unknown', displayName: 'Unknown', avatarUrl: null };
  }
};

const updateProfile = async (formData: FormData): Promise<GenericResponse | ErrorResponse> => {
  try {
    const session = await getServerActionSession();
    if (!session?.user) return generateErrorResponse(401, 'Unauthorized');
    const updateProfilePic = formData.get('updateAvatar') === 'YES';

    const birthday = formData.get('birthday') as string | null;
    const bio = formData.get('bio') as string | null;
    const location = formData.get('location') as string | null;
    const displayName = formData.get('displayName') as string | null;
    const avatar = formData.get('avatar') as File | null;
    let avatarUrl = session.user.avatarUrl;
    if (updateProfilePic) {
      // Note: Upload avatar image to cloudinary or delete it if it's null
      if (avatar) {
        const imageData = new FormData();
        imageData.append('userId', session.user.userId.toString());
        imageData.append('file', avatar);
        avatarUrl = await uploadImageV2(imageData);
      } else if (avatarUrl) {
        const isDeleted: boolean = await deleteImage(session.user.userId);
        avatarUrl = isDeleted ? null : avatarUrl;
      }
    }

    const request: UpdateProfile = {
      birthday: birthday ?? null,
      bio: bio ?? null,
      location: location ?? null,
      displayName: displayName ?? null,
      avatarUrl
    };

    logger.info('Updating user profile data: %s', session.user.username);
    const response = await mdlApiClient.put<UpdateProfile, GenericResponse>(endpoints.user.updateProfile, request);
    logger.info('User profile data updated: %s', session.user.username);

    revalidateTag(`user-profile-${session.user.username}`);
    revalidateTag(`user-profile-${session.user.userId}`);
    logger.info('User profile data revalidated: %s', session.user.username);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error updating recommendation reason : ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

export { cachedGetUserProfileByUsername as getUserProfile, getAuthUserProfile, updateProfile, getUserSummary };