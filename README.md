[![Action Status](https://github.com/lukka/run-cmake/workflows/build/badge.svg)](https://github.com/lukka/run-cmake/actions)

# [GitHub Action for CMake](https://marketplace.github.com/run-cmake)

 ## User Manual
 * [Introduction](#intro)
 * [Quickstart](#quickstart)
 * [The <strong>run-vpkg</strong> action](#run-vcpkg)
 * [Tasks reference: all input parameters](#reference)
 * [Samples](#samples)
 * [Real world project samples](#realworldprojects)
 * [Q&As](#faqs)

 ## Developer Manual
 * [Developers information](#developers-information)
   * [Prerequisites](#prerequisites)
   * [Packaging](#packaging)
   * [Testing](#testing)
     * [Run a test with its javascript file](#run-a-test-with-its-javascript-file)
     * [Run a test with its typescript file](#run-a-test-with-its-typescript-file)
     * [Run a specific test](#run-a-specific-test)
  * [Contributing](#contributing)
  * [License](#license)

## <a id='intro'>Introduction</a>

Build C++ software with [cmake](https://github.com/kitware/cmake). Samples provided use both [self-hosted runners](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/about-self-hosted-runners) or [GitHub hosted runners](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/virtual-environments-for-github-hosted-runners), using [Docker](https://www.docker.com/) and [Pipeline Caching](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/caching-dependencies-to-speed-up-workflows) as well.

TBD

## <a id='contributing'>Contributing</a>

The software is provided as is, there is no warranty of any kind. All users are encouraged to get the [source code](https://github.com/lukka/CppBuildTasks) and improve the tasks with fixes and new features.

# License
All the content in this repository, of the extension and of the 'run-cmake' and 'run-vcpkg' tasks are licensed under the [MIT License](LICENSE.txt).

Copyright (c) 2019 Luca Cappa
