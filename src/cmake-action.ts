// Copyright (c) 2019-2020-2021 Luca Cappa
// Released under the term specified in file LICENSE.txt
// SPDX short identifier: MIT

import * as libaction from '@lukka/action-lib';
import * as runcmakelib from '@lukka/run-cmake-lib'
import * as core from '@actions/core'

const configurePresetCmdStringInput = "CONFIGUREPRESETCMDSTRING";
const buildPresetCmdStringInput = "BUILDPRESETCMDSTRING";
const testPresetCmdStringInput = "TESTPRESETCMDSTRING";
const runVcpkgEnvFormatStringInput = "RUNVCPKGENVFORMATSTRING";

export async function main(): Promise<void> {

  const actionLib: libaction.ActionLib = new libaction.ActionLib();
  try {
    const configurePresetCmdStringFormat = actionLib.getInput(configurePresetCmdStringInput, false);
    const buildPresetCmdStringFormat = actionLib.getInput(buildPresetCmdStringInput, false);
    const testPresetCmdStringFormat = actionLib.getInput(testPresetCmdStringInput, false);
    const runVcpkgEnvFormatString = actionLib.getInput(runVcpkgEnvFormatStringInput, false);
    await runcmakelib.CMakeRunner.run(
      actionLib,
      configurePresetCmdStringFormat,
      buildPresetCmdStringFormat,
      testPresetCmdStringFormat,
      runVcpkgEnvFormatString);
    actionLib.info('run-cmake action execution succeeded');
    process.exitCode = 0;
  } catch (err) {
    const error: Error = err as Error;
    if (error?.stack) {
      actionLib.info(error.stack);
    }
    const errorAsString = (err ?? "undefined error").toString();
    core.setFailed(`run-cmake action execution failed: '${errorAsString}'`);
    process.exitCode = -1000;
  }
}
