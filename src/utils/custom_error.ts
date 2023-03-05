import Boom from 'boom';
export const generateCustomError = (message: string, statusCode: number = 500) => {
  const error = Boom.badRequest(`${message}`);
  error.output.statusCode = statusCode;
  error.message = message;
  error.output.payload.statusCode = statusCode;
  return error;
};
