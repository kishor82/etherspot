import { Server } from '@hapi/hapi';
import Joi from 'joi';
import { Clients } from '..';
import { getTokenFiatValue } from '../controller';
import { wrapError } from '../utils';
export const getTokensFiatValueRoute = (server: Server, clients: Clients) => {
  server.route({
    method: 'GET',
    path: '/token/price',
    options: {
      description: `Get token's fiat value`,
      tags: ['api'],
      validate: {
        query: Joi.object({
          pageNumber: Joi.number().min(1).default(1).optional(),
          pageSize: Joi.number().min(50).max(500).default(0).default(500).optional(),
          currency: Joi.array().items(Joi.string()).default(['usa']).optional().single(),
        }),
      },
      handler: async (request) => {
        try {
          const { pageNumber, pageSize, currency } = request.query;
          return await getTokenFiatValue({ clients, pageNumber, pageSize, currency });
        } catch (error) {
          throw wrapError(error);
        }
      },
    },
  });
};
