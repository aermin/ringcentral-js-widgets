import childProcess from 'child_process';
import config, {
  defaultExecConfig,
  defaultExecLevels,
  defaultDrivers
} from './config';
import createProcess from './utils/createProess';

const rootPath = '<rootDir>/packages/ringcentral-e2e-test/src';
const setupFile = 'lifecycle/setup.js';
const postSetupFile = 'lifecycle/postSetup.js';
const defaultTags = Object.keys(config.params.projects)
  .map(project => [project]);

function getExecTags(rawTags) {
  const isTagsNil = !rawTags || rawTags.length === 0;
  const tags = isTagsNil ? defaultTags : rawTags;
  return tags.map(([project, tag = {}]) => ([
    project, {
      ...defaultExecConfig,
      ...tag,
    }
  ]));
}

export default function runner({
  inputTesterConfig,
  tags,
  drivers = defaultDrivers,
  levels = defaultExecLevels,
  options = [],
}) {
  // exec all project by default if `tags` is nil.
  // TODO alert if tags is nil
  const execTags = getExecTags(tags);
  const testerConfig = {
    ...inputTesterConfig,
    globals: {
      execTags,
      execLevels: levels,
      execDrivers: drivers,
      execGlobal: config,
    },
    // TODO using globalSetup ?
    setupFiles: [`${rootPath}/${setupFile}`],
    setupTestFrameworkScriptFile: `${rootPath}/${postSetupFile}`,
  };
  const command = config.tester;
  // TODO configurative tails
  const tails = ['--forceExit', '--maxWorkers=2'];
  const args = [`--config=${JSON.stringify(testerConfig)}`, ...options, ...tails];
  const close = () => {
    console.log('close');
    childProcess.exec('kill $(ps aux | grep chromedriver | grep -v grep | awk \'{print $2}\')');
  };
  createProcess({
    command,
    args,
    close
  });
}