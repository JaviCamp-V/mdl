import ValidationError from './ValidationError';

export default interface ErrorResponse {
  message: string;
  status: number;
  errors: ValidationError[];
}
