import { Clients } from '..';
import { COIN_IDS, TOKENS_KEY } from '../common';

export const migrateTokens = async ({ redisClient, etherspotSdk, coinGeckoClient }: Clients) => {
  // @ts-ignore
  const [tokens, data] = await Promise.all([etherspotSdk.getTokenListTokens(), coinGeckoClient.coins.list()]);
  const symbolMap: any = {};
  tokens.reduce((map, token) => {
    map[token.symbol.toLowerCase()] = token;
    return map;
  }, symbolMap);

  data.data.forEach((coin: any) => {
    const mapKey = coin.symbol.toLowerCase();
    if (symbolMap[mapKey]) {
      if (coin.id) {
        const tokenData = {
          ...symbolMap[mapKey],
          id: coin.id,
        };
        // Map to ID
        symbolMap[coin.id] = tokenData;
        delete symbolMap[mapKey];
      }
    }
  });
  await redisClient.set(TOKENS_KEY, JSON.stringify(symbolMap));
  const coinIDs = Object.keys(symbolMap);
  await redisClient.set(COIN_IDS, JSON.stringify(coinIDs));
};
