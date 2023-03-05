import { ConfigTypes } from './config_types';

export = {
  logging: {
    silent: false,
    quiet: false,
    verbose: false,
    json: true,
    events: {},
    // Provide destination name starting from the root directory.
    dest: 'stdout',
    filter: {},
    timezone: 'UTC',
    ops: { interval: 5000 },
  },
  server: {
    host: '0.0.0.0',
    port: 7781,
    ssl: {
      enabled: false,
      certificate: '',
      key: '',
      certificateAuthorities: [],
    },
  },
} as ConfigTypes;
