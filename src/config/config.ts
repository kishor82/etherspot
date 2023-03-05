export = {
  logging: {
    silent: false,
    quiet: false,
    verbose: false,
    json: true,
    events: {},
    // Provide destination name starting from the root directory.
    dest: process.env.DEST,
    filter: {},
    timezone: 'UTC',
    ops: { interval: process.env.LOG_INTERVAL },
  },
  server: {
    host: '0.0.0.0',
    port: process.env.SERVER_PORT,
    ssl: {
      enabled: false,
      certificate: '',
      key: '',
      certificateAuthorities: [],
    },
  },
};
