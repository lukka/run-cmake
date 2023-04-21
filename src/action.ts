// Copyright (c) 2019-2020-2021-2022-2023 Luca Cappa
// Released under the term specified in file LICENSE.txt
// SPDX short identifier: MIT

import * as cmakeaction from './cmake-action'

// Main entry point of the task.
cmakeaction.main().catch(error => console.error("main() failed!", error));