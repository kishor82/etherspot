# Overview

This API provides functionality for retrieving and managing token prices and fiat values.

### Installation

- Clone the repository
- Run `nvm use` (if you have nvm installed) and `yarn` from the root directory to install dependencies
- Start Redis server with `docker-compose up`
- Start the server with `yarn start`
- Navigate to `http://0.0.0.0:7781/documentation#` for API documentation.
- Run `yarn test` to run tests

# Backend Technical Test

As part of this test, we’d like to see how you go about building a back-end service that ingests data from a service and
exposes the results via an API.

The overall objective of this technical test is to build a service that fetches a list of tokens, and fetch the fiat value (in USD, GBP- [This must be dynamic. We should be able to add new currency dynamically without code change]) for each token and deliver this via a single API call.

- Use the Etherspot SDK to fetch a list of tokens using the getTokenListTokens()
  method
- Etherspot website
- Etherspot documentation
- Etherspot Playground (getTokenListTokens)
- Use the CoinGecko API to fetch the fiat prices for each of these tokens
- CoinGecko API
- Expose the results of the above two steps via a single API
- Ensure that the code is tested

### Things to think about and keep in mind:

- Some of these API calls are rate limited
- Some of these API calls return large payloads which could affect other services
- Speed and scalability are a primary objective
