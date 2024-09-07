import 'server-only';
import ErrorResponse from '@/types/common/ErrorResponse';
import { generateErrorResponse, isErrorResponse } from './handleError';
import logger from './logger';

const handleServerError = (error: any, action?: string): ErrorResponse => {
  const { data, status } = error?.response ?? {};
  const message = data?.message ?? error?.message;
  logger.error('Error %s:  %s', action ?? 'occurred', message);
  return isErrorResponse(data) ? data : generateErrorResponse(status ?? 408, message);
};

export default handleServerError;
