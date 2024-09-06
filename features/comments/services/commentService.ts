'use server';

import { revalidateTag, unstable_cache } from 'next/cache';
import AccessLevel from '@/features/auth/types/enums/AccessLevel';
import withAuthMiddleware from '@/middleware/withAuthMiddleware';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import HasLikedResponse from '@/types/common/HasLikedResponse';
import TotalResponse from '@/types/common/TotalResponse';
import { getServerActionSession, getSession } from '@/utils/authUtils';
import { generateErrorResponse, isErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';
import CommentType from '../types/enums/CommentType';
import AddComment, { CommentBody } from '../types/interfaces/AddComment';
import { CommentMeta, CommentPage } from '../types/interfaces/Comments';
import handleServerError from '@/utils/handleServerError';


const endpoints = {
  user: {
    addComment: 'user/comments',
    updateComment: 'user/comments/:commentId',
    deleteComment: 'user/comments/:commentId',
    likeComment: 'user/comments/:commentId/like'
  },
  public: {
    getComments: 'comments/:commentType/:parentId',
    getCommentsCount: 'comments/:commentType/:parentId/total',
    getUserComments: 'comments/user/:userId',
    getUserCommentsCount: 'comments/user/:userId/total',
    getCommentLikeCount: 'comments/:commentId/likes',
    geUserCommentLikeStatus: 'comments/:commentId/likes/user/:userId'
  }
};

type CommentResponse = GenericResponse<CommentMeta>;
const addComment = async (commentData: AddComment): Promise<CommentResponse | ErrorResponse> => {
  try {
    logger.info('Adding comment on : %s %s', commentData.commentType, commentData.parentId);
    const endpoint = endpoints.user.addComment;
    const response = await mdlApiClient.post<AddComment, CommentResponse>(endpoint, commentData);
    if (response.data) {
      revalidateTag(`comments-${response.data.commentType}-${response.data.parentId}`);
      revalidateTag(`count-${response.data.commentType}-${response.data.parentId}`);
    }
    return response;
  } catch (error: any) {
    return handleServerError(error, 'adding comment');
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
    return handleServerError(error, 'updating comment');
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
    return handleServerError(error, 'deleting comment');
  }
};

const updateCommentLikes = async (commentId: number, like: boolean): Promise<GenericResponse | ErrorResponse> => {
  try {
    const session = await getServerActionSession();
    if (!session?.user) {
      logger.error('Error updating comment like: User not authenticated');
      return generateErrorResponse(401, 'User not authenticated');
    }
    logger.info('%s comment like with id: %s', like ? 'Liking' : 'Unliking', commentId);

    const endpoint = endpoints.user.likeComment.replace(':commentId', commentId.toString());
    const response = like
      ? await mdlApiClient.post<null, GenericResponse>(endpoint, null)
      : await mdlApiClient.del<GenericResponse>(endpoint);

    revalidateTag(`comment-like-count-${commentId}`);
    revalidateTag(`comment-like-status-${commentId}-${session.user.userId}`);
    return response;
  } catch (error: any) {
    return handleServerError(error, 'updating comment like');
  }
};

const getComments = async (
  commentType: CommentType,
  parentId: number,
  page?: number
): Promise<CommentPage | ErrorResponse> => {
  try {
    logger.info('Fetching comments for %s with id: %s', commentType, parentId);

    const params = new URLSearchParams({ page: page ? page.toString() : '0' });
    const endpoint = endpoints.public.getComments
      .replace(':commentType', commentType)
      .replace(':parentId', parentId.toString());
    const response = await mdlApiClient.get<CommentPage>(endpoint, params);
    return response;
  } catch (error: any) {
    return handleServerError(error, 'fetching comments');
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
    return handleServerError(error, 'fetching comments count');
  }
};
const getCommentLikeCount = async (commentId: number): Promise<TotalResponse> => {
  try {
    logger.info('Fetching comment like count for comment with id: %s', commentId);
    const endpoint = endpoints.public.getCommentLikeCount.replace(':commentId', commentId.toString());
    const response = await mdlApiClient.get<TotalResponse>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'fetching comment like count');
    return { total: 0 };
  }
};

const getUserCommentLikeStatus = async (commentId: number, userId: number): Promise<HasLikedResponse | null> => {
  try {
    logger.info('Fetching comment like status for comment with id: %s', commentId);
    const endpoint = endpoints.public.geUserCommentLikeStatus
      .replace(':commentId', commentId.toString())
      .replace(':userId', userId.toString());
    const response = await mdlApiClient.get<HasLikedResponse>(endpoint);
    return response;
  } catch (error: any) {
    handleServerError(error, 'fetching comment like status');
    return null;
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
    return await getCached(commentType, parentId, page);
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

const getCachedCommentLikeCount = async (commentId: number): Promise<TotalResponse> => {
  try {
    const tagged = `comment-like-count-${commentId}`;
    const getCached = unstable_cache(getCommentLikeCount, [], {
      tags: [tagged]
    });
    return await getCached(commentId);
  } catch (error: any) {
    logger.error('Error fetching comment like count: %s', error.message);
    return { total: 0 };
  }
};

const getCachedUserCommentLikeStatus = async (commentId: number): Promise<HasLikedResponse | null> => {
  try {
    const session = await getServerActionSession();
    if (!session?.user) {
      return null;
    }
    const { userId } = session.user;
    const tagged = `comment-like-status-${commentId}-${userId}`;
    const getCached = unstable_cache(getUserCommentLikeStatus, [], {
      tags: [tagged]
    });
    return await getCached(commentId, userId);
  } catch (error: any) {
    logger.error('Error fetching comment like status: %s', error.message);
    return null;
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
  getCachedCommentLikeCount as getCommentLikeCount,
  getCachedUserCommentLikeStatus as getUserCommentLikeStatus,
  refreshCommentsCache
};