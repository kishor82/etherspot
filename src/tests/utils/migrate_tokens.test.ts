import { COIN_IDS, TOKENS_KEY } from '../../common';
import { migrateTokens } from '../../utils';

describe('migrateTokens', () => {
  const redisClient = {
    set: jest.fn(),
  };
  const etherspotSdk = {
    getTokenListTokens: jest.fn().mockResolvedValue([{ symbol: 'ETH' }, { symbol: 'USDT' }, { symbol: 'WBTC' }, { symbol: 'DAI' }]),
  };
  const coinGeckoClient = {
    coins: {
      list: jest.fn().mockResolvedValue({
        data: [
          { id: 'ethereum', symbol: 'ETH' },
          { id: 'tether', symbol: 'USDT' },
          { id: 'wrapped-bitcoin', symbol: 'WBTC' },
        ],
      }),
    },
  };

  it('should update the token list in redis with the coin ids', async () => {
    // @ts-ignore
    await migrateTokens({ redisClient, etherspotSdk, coinGeckoClient });

    const expectedSymbolMap = {
      dai: { symbol: 'DAI' },
      ethereum: { symbol: 'ETH', id: 'ethereum' },
      tether: { symbol: 'USDT', id: 'tether' },
      'wrapped-bitcoin': { symbol: 'WBTC', id: 'wrapped-bitcoin' },
    };

    expect(redisClient.set).toHaveBeenNthCalledWith(1, TOKENS_KEY, JSON.stringify(expectedSymbolMap));
    expect(redisClient.set).toHaveBeenNthCalledWith(2, COIN_IDS, JSON.stringify(Object.keys(expectedSymbolMap)));
  });

  it('should handle cases where a coin does not have an id', async () => {
    coinGeckoClient.coins.list.mockResolvedValueOnce({
      data: [{ id: 'ethereum', symbol: 'ETH' }, { symbol: 'USDT' }, { id: 'wrapped-bitcoin', symbol: 'WBTC' }],
    });
    // @ts-ignore
    await migrateTokens({ redisClient, etherspotSdk, coinGeckoClient });
    const expectedSymbolMap = {
      dai: { symbol: 'DAI' },
      ethereum: { symbol: 'ETH', id: 'ethereum' },
      tether: { symbol: 'USDT', id: 'tether' },
      'wrapped-bitcoin': { symbol: 'WBTC', id: 'wrapped-bitcoin' },
    };

    expect(redisClient.set).toHaveBeenNthCalledWith(1, TOKENS_KEY, JSON.stringify(expectedSymbolMap));
    expect(redisClient.set).toHaveBeenNthCalledWith(2, COIN_IDS, JSON.stringify(Object.keys(expectedSymbolMap)));
  });
});
