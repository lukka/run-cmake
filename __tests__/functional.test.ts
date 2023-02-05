// Copyright (c) 2019-2020-2021-2023 Luca Cappa
// Released under the term specified in file LICENSE.txt
// SPDX short identifier: MIT

import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as io from '@actions/io'

jest.setTimeout(15 * 1000);

const tempDirectory = path.join(__dirname, "temp Directory");
// Note: 'theAssets' must match the directory __tests__/theAssets/
const assetDirectory = path.join(__dirname, 'theAssets');
// This buildDirectory must be the root of all build directories defined in CMakePreset.json
const buildDirectory = path.join(assetDirectory, "builds");
const testScript = path.join(__dirname, '..', 'dist', 'index.js');
const toolchainFile = path.join(assetDirectory, 'toolchain.cmake');

jest.setTimeout(15 * 1000)

function envTest(useShell: boolean, envVarValue?: string): void {
    const TOOLCHAINFILE = "TOOLCHAINFILE";
    process.env[TOOLCHAINFILE] = envVarValue;
    process.env.INPUT_USESHELL = useShell ? 'true' : 'false';
    process.env.INPUT_CMAKELISTSTXTPATH = path.join(assetDirectory, 'CMakeLists.txt');
    process.env.INPUT_CONFIGUREPRESET = "default-toolchain";
    const options: cp.ExecSyncOptions = {
        env: process.env,
        stdio: "inherit",
    };
    console.log(cp.execSync(`node ${testScript}`, options)?.toString());
}

describe('run-cmake functional tests', () => {
    beforeEach(async () => {
        await io.rmRF(buildDirectory);
        await io.rmRF(tempDirectory);
        await io.mkdirP(buildDirectory);
        await io.mkdirP(tempDirectory);
        Object.keys(process.env)
            .filter((key) => key.match(/^INPUT_/))
            .forEach((key) => {
                delete process.env[key];
            });
        process.env.GITHUB_WORKSPACE = assetDirectory;
    }, 300000);

    afterAll(async () => {
        try {
            await io.rmRF(buildDirectory);
            await io.rmRF(tempDirectory);
        } catch {
            console.log('Failed to remove test directories');
        }
    }, 100000);

    test('configure with Ninja Multi-Config', () => {
        process.env.INPUT_CONFIGUREPRESET = "default-multi"
        process.env.INPUT_CMAKELISTSTXTPATH = path.join(assetDirectory, 'CMakeLists.txt');
        const options: cp.ExecSyncOptions = {
            env: process.env,
            stdio: "inherit"
        };
        console.log(cp.execSync(`node ${testScript}`, options)?.toString());
    });

    test('configure with Ninja', () => {
        process.env.INPUT_CONFIGUREPRESET = "default"
        process.env.INPUT_CMAKELISTSTXTPATH = path.join(assetDirectory, 'CMakeLists.txt');
        const options: cp.ExecSyncOptions = {
            env: process.env,
            stdio: "inherit"
        };
        console.log(cp.execSync(`node ${testScript}`, options)?.toString());
    });

    test('configure and build and test with Ninja', () => {
        process.env.INPUT_CONFIGUREPRESET = "default"
        process.env.INPUT_BUILDPRESET = "default"
        process.env.INPUT_TESTPRESET = "default"
        process.env.INPUT_CMAKELISTSTXTPATH = path.join(assetDirectory, 'CMakeLists.txt');
        const options: cp.ExecSyncOptions = {
            env: process.env,
            stdio: "inherit"
        };
        console.log(cp.execSync(`node ${testScript}`, options)?.toString());
    });

    test('configure and build test with Ninja (Multi-Config)', () => {
        process.env.INPUT_CONFIGUREPRESET = "default-multi"
        process.env.INPUT_BUILDPRESET = "default-multi"
        process.env.INPUT_TESTPRESET = "default-multi"
        process.env.INPUT_CMAKELISTSTXTPATH = path.join(assetDirectory, 'CMakeLists.txt');
        const options: cp.ExecSyncOptions = {
            env: process.env,
            stdio: "inherit"
        };
        console.log(cp.execSync(`node ${testScript}`, options)?.toString());
    });

    test('run workflow', () => {
        process.env.INPUT_WORKFLOWPRESET = "default-workflow";
        process.env.INPUT_BUILDPRESET = "default-multi"; // Must be ignored
        process.env.INPUT_TESTPRESET = "default-multi"; // Must be ignored
        process.env.INPUT_CMAKELISTSTXTPATH = path.join(assetDirectory, 'CMakeLists.txt');
        const options: cp.ExecSyncOptions = {
            env: process.env,
            stdio: "inherit"
        };
        console.log(cp.execSync(`node ${testScript}`, options)?.toString());
    });

    test('basic test for environment variables in input, no shell, it must throw', () => {
        // Building will use an environment variable that will not be
        // resolved since not being run inside a shell, and it will throw.
        expect(() => envTest(false, undefined)).toThrow();
    });

    test('basic test for environment variables in input, with shell', () => {
        envTest(true, toolchainFile);
    });

});
