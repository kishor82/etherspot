import { Server } from '@hapi/hapi';
import Inert from '@hapi/inert';
import { createClient } from 'redis';
import { Sdk, randomPrivateKey } from 'etherspot';
import CoinGecko from 'coingecko-api';
import config from './config';
import logging from './services/logging';
import { migrateTokens } from './utils';
import { routes } from './routes';
import getServerOptions from './services/http_tools';
import registerPlugins from './services/register_plugins';
import { TOKENS_KEY } from './common';

const PRIVATE_KEY = randomPrivateKey();
const sdk = new Sdk(PRIVATE_KEY);
const CoinGeckoClient = new CoinGecko();

export type RedisClientType = ReturnType<typeof createClient>;

export interface Clients {
  redisClient: RedisClientType;
  etherspotSdk?: Sdk;
  coinGeckoClient: CoinGecko;
}

export default async function startRedis(): Promise<RedisClientType> {
  const redis: RedisClientType = createClient();
  await redis.connect();
  return redis;
}

(async () => {
  const server = new Server(getServerOptions(config.server));
  await server.register([{ plugin: Inert }]);
  await logging(server, config);
  try {
    const client = await startRedis();
    // const flused = await client.flushDb();
    // console.log({ flused });
    client.on('error', (error) => console.error(`Error : ${error}`));
    const cached_tokens = await client.get(TOKENS_KEY);
    if (!cached_tokens) {
      await migrateTokens({
        redisClient: client,
        etherspotSdk: sdk,
        coinGeckoClient: CoinGeckoClient,
      });
    }
    await registerPlugins(server);
    routes(server, {
      redisClient: client,
      etherspotSdk: sdk,
      coinGeckoClient: CoinGeckoClient,
    });
    await server.start();
    server.log(['info', 'env'], process.env.NODE_ENV ? process.env.NODE_ENV : 'development'); // Add this into default logging
    server.log(['info', 'listening'], ` Server running at ${server.info.uri}`);
    server.log(['info', 'swagger', 'listening'], `Visit  ${server.info.uri}/documentation# for API documentation.`);
  } catch (err) {
    let reason: any = err;
    if (reason) {
      if (reason.code === 'EADDRINUSE' && Number.isInteger(reason.port)) {
        reason = new Error(`Port ${reason.port} is already in use!`);
      }
      server.log(['fatal'], reason);
      server.stop();
    }
  }
  process.on('unhandledRejection', (err: any) => {
    server.log(['fatal'], err);
  });
})();
