import { Clients } from '..';
import { COIN_IDS, PAGE_NUMBER, PAGE_SIZE, TOKENS_KEY } from '../common';

export const getTokenFiatValue = async ({
  clients: { redisClient, coinGeckoClient },
  pageNumber = PAGE_NUMBER,
  pageSize = PAGE_SIZE,
  currency = ['usd'],
}: {
  clients: Clients;
  pageNumber?: number;
  pageSize?: number;
  currency?: string[];
}) => {
  const cached_tokens = await redisClient.get(TOKENS_KEY);
  const cachedIds = await redisClient.get(COIN_IDS);
  if (cached_tokens) {
    const parsedTokens = JSON.parse(cached_tokens);
    let ids: string[] = JSON.parse(cachedIds as string);
    if (!cachedIds) {
      ids = Object.keys(parsedTokens);
    }
    if (ids.length) {
      const priceResponse = await coinGeckoClient.simple.price({
        ids: ids.slice((pageNumber - 1) * pageSize, pageSize * pageNumber),
        vs_currencies: currency,
      });
      if (priceResponse.data) {
        const priceData = priceResponse.data;
        const response = Object.keys(priceData).reduce((response: any[], id: string) => {
          response.push({
            ...parsedTokens[id],
            id,
            value: priceData[id],
          });
          return response;
        }, []);

        return { returned: response.length, data: response };
      }
    }
  }
  return { returned: 0, data: [] };
};
