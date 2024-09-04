'use server';

import { revalidateTag, unstable_cache } from 'next/cache';
import AccessLevel from '@/features/auth/types/enums/AccessLevel';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import MediaType from '@/types/enums/IMediaType';
import { getServerActionSession, getSession } from '@/utils/authUtils';
import { formDataToValues, formatDate } from '@/utils/formatters';
import { generateErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';
import { formSchema as profileFormSchema } from '../components/forms/settings/model';
import ProfileData from '../types/interfaces/ProfileData';
import UpdateProfile from '../types/interfaces/UpdateProfile';
import { deleteImage, uploadImageV2 } from './cloundairyService';

const endpoints = {
  user: {
    updateProle: 'user/profile'
  },
  public: {
    getProfile: 'profile/:username'
  }
};

const getUserProfile = async (username: string): Promise<ProfileData | null> => {
  logger.info('Fetching user %s profile data', username);
  const endpoint = endpoints.public.getProfile.replace(':username', username);
  return await mdlApiClient.get<ProfileData>(endpoint);
};

const cachedGetUserProfile = async (username: string): Promise<ProfileData | null> => {
  try {
    const getCached = unstable_cache(getUserProfile, [], {
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
    console.log(session);
    const username = session?.user?.username;
    if (!username) return null;
    return await cachedGetUserProfile(username);
  } catch (error: any) {
    logger.error('Error fetching user profile data: %s', error.message);
    return null;
  }
};

const updateProfile = async (formData: FormData): Promise<GenericResponse | ErrorResponse> => {
  try {
    const session = await getSession();
    if (!session?.user) return generateErrorResponse(401, 'Unauthorized');

    const values = profileFormSchema.cast(formDataToValues(formData));
    const isValid = await profileFormSchema.isValid(values);
    if (!isValid) return generateErrorResponse(400, 'Invalid form data.');
    let avatarUrl = session.user.avatarUrl;
    const { birthday, avatar, bio, location, displayName } = values;
    // Upload avatar image to cloudinary or delete it if it's null
    if (avatar) {
      const newAvatarUrl = await uploadImageV2(session.user.userId!, avatar);
      avatarUrl = newAvatarUrl?.secure_url ?? avatarUrl;
    } else if (avatarUrl) {
      const isDeleted = await deleteImage(session.user.userId!);
      avatarUrl = isDeleted ? null : avatarUrl;
    }

    const request: UpdateProfile = {
      birthday: birthday ? formatDate(birthday) : null,
      bio,
      location,
      displayName,
      avatarUrl
    };

    const response = await mdlApiClient.put<UpdateProfile, GenericResponse>(endpoints.user.updateProle, request);
    revalidateTag(`user-profile-${session.user.username}`);
    return response;
  } catch (error: any) {
    return generateErrorResponse(error);
  }
};

export { cachedGetUserProfile as getUserProfile, getAuthUserProfile, updateProfile };
