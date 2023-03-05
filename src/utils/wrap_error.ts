import Boom from 'boom';
export const getErrorStatusCode = (error: any) => {
  return Boom.isBoom(error) ? error.output.statusCode : error.statusCode || error.status;
};

export const wrapError = (error: any) => {
  return Boom.boomify(error, { statusCode: getErrorStatusCode(error) });
};
