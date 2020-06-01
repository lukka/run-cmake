// Copyright (c) 2019-2020 Luca Cappa
// Released under the term specified in file LICENSE.txt
// SPDX short identifier: MIT

import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as io from '@actions/io'

const buildDirectory = path.join(__dirname, "build Directory");
const tempDirectory = path.join(__dirname, "temp Directory");
const assetDirectory = path.join(__dirname, 'theAssets');
const testScript = path.join(__dirname, '..', 'dist', 'index.js');;

jest.setTimeout(15 * 1000)

function envTest(useShell: boolean, envVarValue?: string): void {
    process.env["MYENVVAR"] = envVarValue;
    const MYENVVAR = (process.platform === 'win32') ? "%MYENVVAR%" : "$MYENVVAR";
    process.env.INPUT_USESHELL = useShell ? 'true' : 'false';
    process.env.INPUT_CMAKELISTSORSETTINGSJSON = 'CMakeListsTxtAdvanced';
    process.env.INPUT_BUILDDIRECTORY = buildDirectory;
    process.env.INPUT_CMAKELISTSTXTPATH = path.join(assetDirectory, 'CMakeLists.txt');
    process.env.INPUT_CMAKEAPPENDEDARGS = `%MYENVVAR% -GNinja -DCMAKE_TOOLCHAIN_FILE=${MYENVVAR}`;
    process.env.INPUT_BUILDWITHCMAKE = 'true';
    const options: cp.ExecSyncOptions = {
        env: process.env,
        stdio: "inherit",
    };
    console.log(cp.execSync(`node ${testScript}`, options)?.toString());
}

describe('run-cmake tests', () => {
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

    test('basic test for CMakeListsTxtBasic', () => {
        process.env.INPUT_CMAKELISTSORSETTINGSJSON = 'CMakeListsTxtBasic';
        process.env.INPUT_BUILDDIRECTORY = buildDirectory;
        process.env.INPUT_CMAKEGENERATOR = 'Ninja';
        process.env.INPUT_CMAKEBUILDTYPE = 'Release';
        process.env.INPUT_CMAKELISTSTXTPATH = path.join(assetDirectory, 'CMakeLists.txt');
        process.env.INPUT_BUILDWITHCMAKE = 'true';
        process.env.INPUT_USESHELL = 'true';
        const options: cp.ExecSyncOptions = {
            env: process.env,
            stdio: "inherit"
        };
        console.log(cp.execSync(`node ${testScript}`, options)?.toString());
    });

    test('basic test for CMakeListsTxtBasic with Ninja Multi-Config', () => {
        process.env.INPUT_CMAKELISTSORSETTINGSJSON = 'CMakeListsTxtBasic';
        process.env.INPUT_BUILDDIRECTORY = buildDirectory;
        process.env.INPUT_CMAKEGENERATOR = 'NinjaMulti';
        process.env.INPUT_CMAKEBUILDTYPE = 'Release';
        process.env.INPUT_CMAKELISTSTXTPATH = path.join(assetDirectory, 'CMakeLists.txt');
        process.env.INPUT_BUILDWITHCMAKE = 'true';
        process.env.INPUT_USESHELL = 'true';
        const options: cp.ExecSyncOptions = {
            env: process.env,
            stdio: "inherit"
        };
        console.log(cp.execSync(`node ${testScript}`, options)?.toString());
    });

    test('basic test for CMakeListsTxtAdvanced', () => {
        process.env.INPUT_CMAKELISTSORSETTINGSJSON = 'CMakeListsTxtAdvanced';
        process.env.INPUT_BUILDDIRECTORY = buildDirectory;
        process.env.INPUT_CMAKEAPPENDEDARGS = "-GNinja"
        process.env.INPUT_CMAKELISTSTXTPATH = path.join(assetDirectory, 'CMakeLists.txt');
        process.env.INPUT_BUILDWITHCMAKE = 'true';
        process.env.INPUT_USESHELL = 'true';
        const options: cp.ExecSyncOptions = {
            env: process.env,
            stdio: "inherit"
        };
        console.log(cp.execSync(`node ${testScript}`, options)?.toString());
    });

    test('basic test for CMakeSettingsJson', () => {
        process.env.INPUT_CMAKELISTSORSETTINGSJSON = 'CMakeSettingsJson';
        process.env.INPUT_BUILDDIRECTORY = buildDirectory;
        // Avoid executing tests with VS generators because of: https://github.com/lukka/run-cmake/issues/26
        process.platform === "win32" ? 
            process.env.INPUT_CONFIGURATIONREGEXFILTER = 'x64-.*':
            process.env.INPUT_CONFIGURATIONREGEXFILTER = '.*inux.*';
        process.env.INPUT_CMAKESETTINGSJSONPATH = path.join(assetDirectory, 'CMakeSettings.json');
        process.env.INPUT_BUILDWITHCMAKE = 'true';
        process.env.INPUT_USESHELL = 'true';
        process.env['GITHUB_WORKSPACE'] = tempDirectory;
        const options: cp.ExecSyncOptions = {
            env: process.env,
            stdio: "inherit"
        };
        console.log(cp.execSync(`node ${testScript}`, options)?.toString());
    })

    test('basic test for environment variables in input, no shell', () => {
        // Since building will be using an environment variable that will not be
        // resolved since not being run inside a shell, it will throw.
        expect(() => envTest(false, undefined)).toThrow();
    });

    test('basic test for environment variables in input, with shell', () => {
        envTest(true, path.join(assetDirectory, "toolchain.cmake"));
    });

});