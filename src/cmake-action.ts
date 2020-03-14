// Copyright (c) 2019 Luca Cappa
// Released under the term specified in file LICENSE.txt
// SPDX short identifier: MIT

import * as libaction from './action-lib';
import * as core from '@actions/core'
import * as cmakerunner from './cmake-runner';
import * as utils from './utils';

async function main(): Promise<void> {
  try {
    const actionLib: libaction.ActionLib = new libaction.ActionLib();
    utils.setBaseLib(actionLib);
    const runner: cmakerunner.CMakeRunner = new cmakerunner.CMakeRunner(actionLib);
    await runner.run();
    core.info('run-cmake action execution succeeded');
    process.exitCode = 0;
  } catch (err) {
    const errorAsString = (err ?? "undefined error").toString();
    core.debug('Error: ' + errorAsString);
    core.error(errorAsString);
    core.setFailed('run-cmake action execution failed');
    process.exitCode = -1000;
  }
}

// Main entry point of the task.
main().catch(error => console.error("main() failed!", error));