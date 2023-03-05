import { join } from 'path';
import { ConfigTypes } from './config_types';
const ENV = process.env && process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';
console.log({ ENV });
let config_path = 'config';
if (ENV !== 'production') {
  config_path = `config.${ENV}`;
}
const config: ConfigTypes = require(join(__dirname, config_path));
export default config;
