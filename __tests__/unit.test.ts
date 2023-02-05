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
        // Assert
        expect(setFailedMock).toBeCalledTimes(1);
    });

});
