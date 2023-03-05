export interface ConfigTypes {
  logging: {
    silent: boolean;
    quiet: boolean;
    verbose: boolean;
    json: boolean;
    events: {};
    dest: string;
    filter: {};
    timezone: string;
    ops: {
      interval: number;
    };
  };
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      certificate: string;
      key: string;
      certificateAuthorities: never[];
    };
  };
}
