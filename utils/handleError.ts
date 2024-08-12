import ErrorResponse from '@/types/common/ErrorResponse';
import ValidationError from '@/types/common/ValidationError';

const formatErrorsAsObject = (errors: ValidationError[]) => {
  return errors?.reduce((acc, error) => ({ ...acc, [error.field]: error.message }), {});
};

const formatErrorsAsString = (errors: ValidationError[]) => {
  return errors?.map((error) => error.message).join(', ');
};

const defaultResponse = {
  400: 'Bad Request, invalid parameters',
  401: 'Unauthorized',
  403: 'Forbidden',
  408: 'Something went wrong'
};

const generateErrorResponse = (status: number, message?: string): ErrorResponse => {
  const statusMessage = status in defaultResponse ? (defaultResponse as any)[status] : 'Something went wrong';
  return {
    message: message ?? statusMessage,
    status,
    errors: []
  };
};

export { formatErrorsAsObject, formatErrorsAsString, generateErrorResponse };
