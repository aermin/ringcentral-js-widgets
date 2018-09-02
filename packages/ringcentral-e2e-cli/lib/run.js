import { resolve } from 'path';
import runner from '../src/runner.js';
import { isNil } from '../src/utils/checkType';

const DEFAULT_CONFIG_FILE_PATH = './e2e.config.js';
const DEFAULT_ROOT = '<rootDir>';
const DEFAULT_TEST_MATCH = '**/?(*.)+(spec|test).js?(x)';
const configPath = resolve(process.cwd(), DEFAULT_CONFIG_FILE_PATH);

function getArgs(dir, cmd) {
  let args;
  try {
    args = cmd.params ? JSON.parse(`{"params": ${cmd.params}}`) : {};
  } catch (e) {
    console.error('Unexpected params parameters format.');
    process.exit();
  }
  args.paths = dir;
  return args;
}

function getTestMatch(args) {
  return (
    args.paths.length > 0 ?
      args.paths.map(path => `${DEFAULT_ROOT}/${path.replace(/^\.\//, '')}`) :
      [`${DEFAULT_ROOT}/${DEFAULT_TEST_MATCH}`]
  );
}


const run = (dir, cmd) => {
  if (isNil(dir)) {
    console.error('Unexpected parameters format.');
    process.exit();
    return;
  }
  const args = getArgs(dir, cmd);
  let config;
  try {
    // eslint-disable-next-line
    config = require(configPath);
  } catch (error) {
    console.error(`Unexpected import '${DEFAULT_CONFIG_FILE_PATH}' in root path.`);
    process.exit();
    return;
  }
  const testMatch = getTestMatch(args);
  const modes = [
    ...cmd.sandbox ? ['sandbox'] : [],
    ...cmd.debugger ? ['debugger'] : [],
  ];
  const drivers = cmd.drivers || [];
  const params = args.params || {};
  const testerCLI = cmd.testerCLI || [];
  const testerParams = {
    verbose: true,
    testMatch,
  };
  const testParams = {
    testerParams,
    testerCLI,
    modes,
    drivers,
    params,
    config,
  };
  const exit = () => {
    process.exit();
  };
  runner(testParams, {
    exit
  });
};

export {
  run as default,
  configPath
};
