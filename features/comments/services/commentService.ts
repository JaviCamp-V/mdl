'use server';

import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import AccessLevel from '@/features/auth/types/enums/AccessLevel';
import withAuthMiddleware from '@/middleware/withAuthMiddleware';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import TotalResponse from '@/types/common/TotalResponse';
import { getSession } from '@/utils/authUtils';
import { generateErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';
import CommentType from '../types/enums/CommentType';
import AddComment, { CommentBody } from '../types/interfaces/AddComment';
import { CommentMeta, CommentPage } from '../types/interfaces/Comments';

const endpoints = {
  user: {
    addComment: 'user/comments',
    updateComment: 'user/comments/:commentId',
    deleteComment: 'user/comments/:commentId',
    likeComment: 'user/comments/:commentId/like'
  },
  public: {
    getComments: 'comments/:commentType/:parentId',
    getCommentsCount: 'comments/:commentType/:parentId/count',
    getUserComments: 'comments/user/:userId',
    getUserCommentsCount: 'comments/user/:userId/count'
  }
};

type CommentResponse = GenericResponse<CommentMeta>;
const addComment = async (commentData: AddComment): Promise<CommentResponse | ErrorResponse> => {
  try {
    logger.info('Adding comment on : %s &s', commentData.commentType, commentData.parentId);
    const endpoint = endpoints.user.addComment;
    const response = await mdlApiClient.post<AddComment, CommentResponse>(endpoint, commentData);
    if (response.data) {
      revalidateTag(`comments-${response.data.commentType}-${response.data.parentId}`);
      revalidateTag(`count-${response.data.commentType}-${response.data.parentId}`);
    }
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error('Error adding comment:  %s', message);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const updateComment = async (commentId: number, commentBody: CommentBody): Promise<CommentResponse | ErrorResponse> => {
  try {
    logger.info('Updating comment with id: %s', commentId);
    const endpoint = endpoints.user.updateComment.replace(':commentId', commentId.toString());
    const response = await mdlApiClient.put<CommentBody, CommentResponse>(endpoint, commentBody);
    if (response.data) {
      revalidateTag(`comments-${response.data.commentType}-${response.data.parentId}`);
    }
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error('Error updating comment: %s', message);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const deleteComment = async (
  commentType: CommentType,
  parentId: number,
  commentId: number
): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('Deleting comment with id: %s', commentId);
    const endpoint = endpoints.user.deleteComment.replace(':commentId', commentId.toString());
    const response = await mdlApiClient.del<GenericResponse>(endpoint);
    revalidateTag(`comments-${commentType}-${parentId}`);
    revalidateTag(`count-${commentType}-${parentId}`);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error('Error deleting comment: %s', message);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const updateCommentLikes = async (
  CommentType: CommentType,
  parentId: number,
  commentId: number,
  like: boolean
): Promise<GenericResponse | ErrorResponse> => {
  try {
    logger.info('%s comment like with id: %s', like ? 'Liking' : 'Unliking', commentId);
    const endpoint = endpoints.user.likeComment.replace(':commentId', commentId.toString());
    const response = like
      ? await mdlApiClient.post<null, GenericResponse>(endpoint, null)
      : await mdlApiClient.del<GenericResponse>(endpoint);
    revalidateTag(`comments-${CommentType}-${parentId}`);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error('Error updating comment like: %s', message);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getComments = async (
  commentType: CommentType,
  parentId: number,
  page?: number,
  userId?: number | null
): Promise<CommentPage | ErrorResponse> => {
  try {
    logger.info('Fetching comments for %s with id: %s', commentType, parentId);

    const params = new URLSearchParams({ page: page ? page.toString() : '0' });
    if (userId) params.append('userId', userId.toString());
    const endpoint = endpoints.public.getComments
      .replace(':commentType', commentType)
      .replace(':parentId', parentId.toString());
    const response = await mdlApiClient.get<CommentPage>(endpoint, { params });
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error('Error fetching comments: %s', message);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getCommentsCount = async (commentType: CommentType, parentId: number): Promise<TotalResponse | ErrorResponse> => {
  try {
    logger.info('Fetching comments count for %s with id: %s', commentType, parentId);
    const endpoint = endpoints.public.getCommentsCount
      .replace(':commentType', commentType)
      .replace(':parentId', parentId.toString());
    const response = await mdlApiClient.get<TotalResponse>(endpoint);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error('Error fetching comments count: %s', message);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getUserComments = async (userId: number, page?: number): Promise<CommentPage | ErrorResponse> => {
  try {
    logger.info('Fetching comments for user with id: %s', userId);
    const params = new URLSearchParams({ page: page ? page.toString() : '0' });
    const endpoint = endpoints.public.getUserComments.replace(':userId', userId.toString());
    const response = await mdlApiClient.get<CommentPage>(endpoint, { params });
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error('Error fetching user comments: %s', message);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getUserCommentsCount = async (userId: number): Promise<TotalResponse | ErrorResponse> => {
  try {
    logger.info('Fetching comments count for user with id: %s', userId);
    const endpoint = endpoints.public.getUserCommentsCount.replace(':userId', userId.toString());
    const response = await mdlApiClient.get<TotalResponse>(endpoint);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error('Error fetching user comments count: %s', message);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

// auth wrappers

const addCommentHandler = withAuthMiddleware(addComment, AccessLevel.MEMBER);
const updateCommentHandler = withAuthMiddleware(updateComment, AccessLevel.MEMBER);
const deleteCommentHandler = withAuthMiddleware(deleteComment, AccessLevel.MEMBER);
const updateCommentLikesHandler = withAuthMiddleware(updateCommentLikes, AccessLevel.MEMBER);

//caching wrapping

const getCommentsCacheHandler = async (
  commentType: CommentType,
  parentId: number,
  page?: number
): Promise<CommentPage | ErrorResponse> => {
  try {
    const getCached = unstable_cache(getComments, [`${page}`], {
      tags: [`comments-${commentType}-${parentId}`]
    });
    const session = await getSession();
    const userId = session?.user?.userId;
    return await getCached(commentType, parentId, page, userId);
  } catch (error: any) {
    logger.error('Error fetching comments: %s', error.message);
    return generateErrorResponse(500, error.message);
  }
};

const getCachedCommentsCount = async (
  commentType: CommentType,
  parentId: number
): Promise<TotalResponse | ErrorResponse> => {
  try {
    const tagged = `count-${commentType}-${parentId}`;
    const getCached = unstable_cache(getCommentsCount, [], {
      tags: [tagged]
    });
    return await getCached(commentType, parentId);
  } catch (error: any) {
    logger.error('Error fetching comments count: %s', error.message);
    return generateErrorResponse(500, error.message);
  }
};

const refreshCommentsCache = (commentType: CommentType, parentId: number): void => {
  const tagged = `count-${commentType}-${parentId}`;
  revalidateTag(tagged);
};
export {
  addCommentHandler as addComment,
  updateCommentHandler as updateComment,
  deleteCommentHandler as deleteComment,
  updateCommentLikesHandler as updateCommentLikes,
  getCommentsCacheHandler as getComments,
  getCachedCommentsCount as getCommentsCount,
  refreshCommentsCache
};
