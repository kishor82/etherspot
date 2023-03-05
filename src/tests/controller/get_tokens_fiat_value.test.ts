import { getTokenFiatValue } from '../../controller';

describe('getTokenFiatValue', () => {
  const clients = {
    redisClient: {
      get: jest.fn(),
    },
    coinGeckoClient: {
      simple: {
        price: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should return token fiat values when Redis has cached data and CoinGecko API returns valid data', async () => {
    clients.redisClient.get.mockResolvedValueOnce(
      '{"bitcoin": {"name": "Bitcoin", "symbol": "BTC", "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"}}'
    );
    clients.redisClient.get.mockResolvedValueOnce('["bitcoin"]');
    clients.coinGeckoClient.simple.price.mockResolvedValueOnce({ data: { bitcoin: { usd: 54000 } } });

    const pageNumber = 1;
    const pageSize = 10;
    const currency = ['usd'];
    //@ts-ignore
    const result = await getTokenFiatValue({ clients, pageNumber, pageSize, currency });

    expect(result).toEqual({
      returned: 1,
      data: [
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          id: 'bitcoin',
          value: { usd: 54000 },
        },
      ],
    });
    expect(clients.redisClient.get).toHaveBeenCalledTimes(2);
    expect(clients.redisClient.get).toHaveBeenNthCalledWith(1, expect.any(String));
    expect(clients.redisClient.get).toHaveBeenNthCalledWith(2, expect.any(String));
    expect(clients.coinGeckoClient.simple.price).toHaveBeenCalledTimes(1);
    expect(clients.coinGeckoClient.simple.price).toHaveBeenCalledWith({
      ids: ['bitcoin'],
      vs_currencies: ['usd'],
    });
  });

  test('should return empty array when Redis has no cached data', async () => {
    clients.redisClient.get.mockResolvedValue(null);
    clients.redisClient.get.mockResolvedValueOnce(null);
    clients.coinGeckoClient.simple.price.mockResolvedValueOnce({ data: {} });

    const pageNumber = 1;
    const pageSize = 10;
    const currency = ['usd'];
    //@ts-ignore
    const result = await getTokenFiatValue({ clients, pageNumber, pageSize, currency });

    expect(result).toEqual({ returned: 0, data: [] });
    expect(clients.redisClient.get).toHaveBeenCalledTimes(2);
    expect(clients.redisClient.get).toHaveBeenNthCalledWith(1, expect.any(String));
    expect(clients.redisClient.get).toHaveBeenNthCalledWith(2, expect.any(String));
    expect(clients.coinGeckoClient.simple.price).toHaveBeenCalledTimes(0);
  });

  test('should throw an error when CoinGecko API returns an error', async () => {
    clients.redisClient.get.mockResolvedValueOnce(
      '{"bitcoin": {"name": "Bitcoin", "symbol": "BTC", "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"}}'
    );
    clients.redisClient.get.mockResolvedValueOnce('["bitcoin"]');
    clients.coinGeckoClient.simple.price.mockRejectedValueOnce(new Error('API error'));

    const pageNumber = 1;
    const pageSize = 10;
    const currency = ['usd'];
    //@ts-ignore
    await expect(getTokenFiatValue({ clients, pageNumber, pageSize, currency })).rejects.toThrow('API error');
    expect(clients.redisClient.get).toHaveBeenCalledTimes(2);
    expect(clients.redisClient.get).toHaveBeenNthCalledWith(1, expect.any(String));
    expect(clients.redisClient.get).toHaveBeenNthCalledWith(2, expect.any(String));
    expect(clients.coinGeckoClient.simple.price).toHaveBeenCalledTimes(1);
    expect(clients.coinGeckoClient.simple.price).toHaveBeenCalledWith({
      ids: ['bitcoin'],
      vs_currencies: ['usd'],
    });
  });

  test('should return empty array when Redis has cached data but CoinGecko API returns no data', async () => {
    clients.redisClient.get.mockResolvedValueOnce(
      '{"bitcoin": {"name": "Bitcoin", "symbol": "BTC", "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"}}'
    );
    clients.redisClient.get.mockResolvedValueOnce('["bitcoin"]');
    clients.coinGeckoClient.simple.price.mockResolvedValueOnce({ data: {} });

    const pageNumber = 1;
    const pageSize = 10;
    const currency = ['usd'];
    //@ts-ignore
    const result = await getTokenFiatValue({ clients, pageNumber, pageSize, currency });

    expect(result).toEqual({ returned: 0, data: [] });
    expect(clients.redisClient.get).toHaveBeenCalledTimes(2);
    expect(clients.redisClient.get).toHaveBeenNthCalledWith(1, expect.any(String));
    expect(clients.redisClient.get).toHaveBeenNthCalledWith(2, expect.any(String));
    expect(clients.coinGeckoClient.simple.price).toHaveBeenCalledTimes(1);
    expect(clients.coinGeckoClient.simple.price).toHaveBeenCalledWith({
      ids: ['bitcoin'],
      vs_currencies: ['usd'],
    });
  });
});
