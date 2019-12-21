// Copyright (c) 2019 Luca Cappa
// Released under the term specified in file LICENSE.txt
// SPDX short identifier: MIT

import * as libaction from './action-lib';
import * as core from '@actions/core'
import * as cmakerunner from './cmake-runner';
import * as utils from './utils';

async function main(): Promise<number> {
  try {
    const actionLib: libaction.ActionLib = new libaction.ActionLib();
    utils.setBaseLib(actionLib);
    const runner: cmakerunner.CMakeRunner = new cmakerunner.CMakeRunner(actionLib);
    await runner.run();
    core.info('run-cmake action execution succeeded');
    return 0;
  } catch (err) {
    core.debug('Error: ' + err);
    core.error(err);
    core.setFailed('run-cmake action execution failed');
    return -1000;
  }
}

// Main entry point of the task.
main().catch(error => console.error("main() failed!", error));