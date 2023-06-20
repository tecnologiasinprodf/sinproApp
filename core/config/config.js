const devConfig = require('../../assets/config.dev.json');
const config = require('../../assets/config.json');

export default function getConfig() {
  if (__DEV__) {
    return devConfig;
  }
  return config;
}
