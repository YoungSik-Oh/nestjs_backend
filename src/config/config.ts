import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YML_CONFIG_DEV = 'dev.yml';
const YML_CONFIG_PROD = 'prod.yml';

export default () => {
  return yaml.load(
    process.env.NODE_ENV === 'dev'
      ? readFileSync(join(__dirname, YML_CONFIG_DEV), 'utf-8')
      : readFileSync(join(__dirname, YML_CONFIG_PROD), 'utf-8'),
  );
};
