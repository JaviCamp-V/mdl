'use server';

import mdlApiClient from '@/clients/mdlApiClient';
import AuthResponse from '@/types/Auth/IAuthResposne';
import CreateUserRequest from '@/types/Auth/ICreateUserRequest';
import ErrorResponse from '@/types/common/ErrorResponse';
import GenericResponse from '@/types/common/GenericResponse';
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
    return await mdlApiClient.post<CreateUserRequest, AuthResponse>(endpoints.register, request);
  } catch (error: any) {
    logger.error('Error signing up user: ', error?.message);
    return error.response.data ?? error;
  }
};

const login = async (request: Omit<CreateUserRequest, 'email'>): Promise<AuthResponse | ErrorResponse> => {
  try {
    logger.info('Logging in user with username: ', request.username);
    return await mdlApiClient.post<Omit<CreateUserRequest, 'email'>, AuthResponse>(endpoints.login, request);
  } catch (error: any) {
    logger.error('Error logging in user: ', error);
    console.log(error);
    return error.response.data ?? error;
  }
};

const logout = async (): Promise<GenericResponse> => {
  try {
    logger.info('Logging out user');
    return await mdlApiClient.del<GenericResponse>(endpoints.logout);
  } catch (error: any) {
    logger.error('Error logging out user: ', error);
    return error.response.data ?? error;
  }
};

const refreshAuthToken = async (): Promise<AuthResponse | ErrorResponse> => {
  try {
    logger.info('Refreshing token');
    return await mdlApiClient.refreshAuthToken<AuthResponse>(endpoints.refreshToken);
  } catch (error: any) {
    logger.error('Error refreshing token: ', error);
    console.log(error);
    return error.response.data ?? error;
  }
};

export { signUp, login, logout, refreshAuthToken };