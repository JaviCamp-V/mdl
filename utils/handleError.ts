import ValidationError from '@/types/common/ValidationError';

const formatErrorsAsObject = (errors: ValidationError[]) => {
  return errors?.reduce((acc, error) => ({ ...acc, [error.field]: error.message }), {});
};

const formatErrorsAsString = (errors: ValidationError[]) => {
  return errors?.map((error) => error.message).join(', ');
};

export { formatErrorsAsObject, formatErrorsAsString };
