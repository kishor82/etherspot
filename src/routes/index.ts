import { Server } from '@hapi/hapi';
import { Clients } from '..';
import { getTokensFiatValueRoute } from './get_tokens_fiat_value';

export const routes = (server: Server, clients: Clients) => {
  getTokensFiatValueRoute(server, clients);
};
