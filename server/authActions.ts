'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import mdlApiClient from '@/clients/mdlApiClient';
import AuthResponse from '@/types/Auth/IAuthResposne';
import CreateUserRequest from '@/types/Auth/ICreateUserRequest';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
import { generateErrorResponse } from '@/utils/handleError';
import logger from '@/utils/logger';

const endpoints = {
  login: 'auth/login',
  logout: 'auth/logout',
  register: 'auth/signup',
  verify: 'auth/verify',
  forgotPassword: 'auth/forgot-password',
  resetPassword: 'auth/reset-password',
  refreshToken: 'auth/refresh-token'
};

const signUp = async (request: CreateUserRequest): Promise<AuthResponse | ErrorResponse> => {
  try {
    logger.info('Signing up user with email: ', request.email);
    const response = await mdlApiClient.post<CreateUserRequest, AuthResponse>(endpoints.register, request);
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
    logger.info('Logging in user with username: ', request.username);
    const resposne = await mdlApiClient.post<Omit<CreateUserRequest, 'email'>, AuthResponse>(endpoints.login, request);
    return resposne;
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error logging token: ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const logout = async (): Promise<GenericResponse> => {
  try {
    logger.info('Logging out user');
    return await mdlApiClient.del<GenericResponse>(endpoints.logout);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error('Error logging out user ', message);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

const refreshAuthToken = async (): Promise<AuthResponse | ErrorResponse> => {
  try {
    logger.info('Refreshing token');
    return await mdlApiClient.refreshAuthToken<AuthResponse>(endpoints.refreshToken);
  } catch (error: any) {
    const message = error?.response?.data?.message ?? error?.message;
    const status = error?.response?.status ?? 408;
    logger.error(`Error refreshing token: ${message}`);
    return error.response.data ?? generateErrorResponse(status, message);
  }
};

export { signUp, login, logout, refreshAuthToken };
