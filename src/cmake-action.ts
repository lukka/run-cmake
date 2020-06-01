// Copyright (c) 2019 Luca Cappa
// Released under the term specified in file LICENSE.txt
// SPDX short identifier: MIT

import * as libaction from '@lukka/action-lib';
import * as runcmakelib from '@lukka/run-cmake-lib'
import * as core from '@actions/core'

async function main(): Promise<void> {
  try {
    const actionLib: libaction.ActionLib = new libaction.ActionLib();
    const runner: runcmakelib.CMakeRunner = new runcmakelib.CMakeRunner(actionLib);
    await runner.run();
    core.info('run-cmake action execution succeeded');
    process.exitCode = 0;
  } catch (err) {
    const error: Error = err as Error;
    if (error?.stack) {
      core.info(error.stack);
    }
    const errorAsString = (err ?? "undefined error").toString();
    core.setFailed(`run-cmake action execution failed: '${errorAsString}'`);
    process.exitCode = -1000;
  }
}

// Main entry point of the task.
main().catch(error => console.error("main() failed!", error));