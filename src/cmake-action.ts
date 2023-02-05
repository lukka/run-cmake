// Copyright (c) 2019-2020-2021-2022-2023 Luca Cappa
// Released under the term specified in file LICENSE.txt
// SPDX short identifier: MIT

import * as libaction from '@lukka/action-lib';
import * as runcmakelib from '@lukka/run-cmake-lib'
import * as cmakeglobals from '@lukka/run-cmake-lib/build/cmake-globals'
import * as vcpkgglobals from '@lukka/run-cmake-lib/build/vcpkg-globals'
import * as core from '@actions/core'


export async function main(): Promise<void> {

  const actionLib: libaction.ActionLib = new libaction.ActionLib();
  try {
    const configurePreset = actionLib.getInput(cmakeglobals.configurePreset, false);
    const buildPreset = actionLib.getInput(cmakeglobals.buildPreset, false);
    const testPreset = actionLib.getInput(cmakeglobals.testPreset, false);
    const workflowPreset = actionLib.getInput(cmakeglobals.workflowPreset, false);
    const workflowPresetCmdStringFormat = actionLib.getInput(cmakeglobals.workflowPresetFormat, false);
    const configurePresetCmdStringFormat = actionLib.getInput(cmakeglobals.configurePresetFormat, false);
    const buildPresetCmdStringFormat = actionLib.getInput(cmakeglobals.buildPresetFormat, false);
    const testPresetCmdStringFormat = actionLib.getInput(cmakeglobals.testPresetFormat, false);
    const configurePresetAdditionalArgs = actionLib.getInput(cmakeglobals.configurePresetAdditionalArgs, false);
    const buildPresetAdditionalArgs = actionLib.getInput(cmakeglobals.buildPresetAdditionalArgs, false);
    const testPresetAdditionalArgs = actionLib.getInput(cmakeglobals.testPresetAdditionalArgs, false);
    const runVcpkgEnvFormatString = actionLib.getInput(vcpkgglobals.runVcpkgEnvFormatStringInput, false);
    await runcmakelib.CMakeRunner.run(
      actionLib,
      workflowPreset, workflowPresetCmdStringFormat,
      configurePreset, configurePresetCmdStringFormat, configurePresetAdditionalArgs,
      buildPreset, buildPresetCmdStringFormat, buildPresetAdditionalArgs,
      testPreset, testPresetCmdStringFormat, testPresetAdditionalArgs,
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
