// Copyright (c) 2019-2020-2021-2022-2023 Luca Cappa
// Released under the term specified in file LICENSE.txt
// SPDX short identifier: MIT

import * as core from '@actions/core'
import * as cmakeaction from '../src/cmake-action'
import * as runcmakelib from '@lukka/run-cmake-lib'

jest.setTimeout(15 * 1000);
// Mocks entire action-lib module.
jest.mock("@lukka/run-cmake-lib");

describe('run-cmake unit tests', () => {
    test('run without exception', async () => {
        await cmakeaction.main();
    });

    test('run with exception, it must fail', async () => {
        // Arrange
        const setFailedMock = jest.spyOn(core, "setFailed");
        jest.spyOn(runcmakelib.CMakeRunner, "run").mockImplementation(() => { throw new Error(); })
        // Act
        await cmakeaction.main();

        // The failure sets an exit code different than 0, and this will fail `npm run test`.
        // On node20+ on Linux/Windows (but not on macOS) this leads to a failing exit 
        // code: https://github.com/jestjs/jest/issues/14501
        process.exitCode = 0;

        // Assert
        expect(setFailedMock).toBeCalledTimes(1);
    });

});
