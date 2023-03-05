import { ResponseToolkit, Request } from '@hapi/hapi';
import Hoek from 'hoek';
const failActionHandler = (request: Request, h: ResponseToolkit, err?: any) => {
  if (err && err.name === 'ValidationError' && err.hasOwnProperty('output')) {
    const validationError = err;
    const validationKeys: string[] = [];
    const validationMessage: string[] = [];

    validationError.details.forEach((detail: { path: any[]; message: string }) => {
      if (detail.path.length > 0) {
        validationKeys.push(Hoek.escapeHtml(detail.path.join('.')));
        validationMessage.push(detail.message);
      } else {
        // If no path, use the value sigil to signal the entire value had an issue.
        validationKeys.push('value');
        validationMessage.push('Invalid request payload.');
      }
    });
    validationError.output.payload.validation.keys = validationKeys;
    validationError.output.payload.message = validationMessage;
  }
  throw err;
};

export default failActionHandler;
