'use server';

import { revalidateTag } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import mdlApiClient from '@/clients/mdlApiClient';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import { getServerActionSession } from '@/utils/authUtils';
import { generateErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';
import { X_Device_ID } from '@/libs/common';
import AuthResponse from '../types/interfaces/AuthResposne';
import CreateUserRequest from '../types/interfaces/CreateUserRequest';
import RefreshTokenRequest from '../types/interfaces/ResfreshTokenRequest';
import UserAccountResponse from '../types/interfaces/UserAccountResponse';

const endpoints = {
  login: 'auth/login',
  logout: 'auth/logout',
  register: 'auth/signup',
  verify: 'auth/verify',
  forgotPassword: 'auth/forgot-password',
  resetPassword: 'auth/reset-password',
  refreshToken: 'auth/refresh-token',
  account: 'account',
  heartbeat: 'heartbeat'
};

const signUp = async (request: CreateUserRequest): Promise<AuthResponse | ErrorResponse> => {
  try {
    logger.info('Signing up user with email: %s', request.email);
    const headers = { [X_Device_ID]: uuidv4() };
    const response = await mdlApiClient.post<CreateUserRequest, AuthResponse>(
      endpoints.register,
      request,
      undefined,
      headers
    );
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;

    logger.error(`Error signing up  : ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const login = async (request: Omit<CreateUserRequest, 'email'>): Promise<AuthResponse | ErrorResponse> => {
  try {
    logger.info('Logging in user with username: %s ', request.username);
    const headers = { [X_Device_ID]: uuidv4() };
    const response = await mdlApiClient.post<Omit<CreateUserRequest, 'email'>, AuthResponse>(
      endpoints.login,
      request,
      undefined,
      headers
    );
    return response;
  } catch (error: any) {
    const status = error?.response?.status ?? 408;
    const message = error?.response?.data?.message ?? error?.message;
    logger.error(`Error logging token: ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const logout = async (): Promise<GenericResponse> => {
  try {
    logger.info('Logging out user');
    return await mdlApiClient.logout(endpoints.logout);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error('Error logging out user %s', message);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const getAccount = async (accessToken: string): Promise<UserAccountResponse | ErrorResponse> => {
  try {
    logger.info('Getting account details');
    const headers = { Authorization: `Bearer ${accessToken}` };
    return await mdlApiClient.get<UserAccountResponse>(endpoints.account, undefined, headers);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error('Error getting account details %s ', message);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const updateLastActive = async (): Promise<void> => {
  try {
    const session = await getServerActionSession();
    if (!session?.user) return;
    logger.info('Updating last active');
    const response = await mdlApiClient.post<null, GenericResponse>(endpoints.heartbeat, null);
    logger.info(response.message);
    revalidateTag(`user-profile-${session.user.username}`);
    revalidateTag(`user-profile-${session.user.userId}`);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    logger.error('Error updating last active %s', message);
  }
};

const refreshAuthToken = async (refreshToken: string): Promise<AuthResponse | ErrorResponse> => {
  logger.info('Refreshing token');
  try {
    return await mdlApiClient.post<RefreshTokenRequest, AuthResponse>(endpoints.refreshToken, { refreshToken });
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error refreshing token: ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

export { signUp, login, logout, refreshAuthToken, getAccount, updateLastActive };
