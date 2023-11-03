[![Action Status](https://github.com/lukka/run-cmake/workflows/build-test/badge.svg)](https://github.com/lukka/run-cmake/actions)

[![Coverage Status](https://coveralls.io/repos/github/lukka/run-cmake/badge.svg?branch=main)](https://coveralls.io/github/lukka/run-cmake?branch=main)

- [Quickstart with a C++ project template](#quickstart-with-a-c-project-template)
- [**run-cmake@v10** runs CMake with CMakePresets.json](#run-cmakev10-runs-cmake-with-cmakepresetsjson)
  - [Quickstart with instructions](#quickstart-with-instructions)
  - [Action reference: all input/output parameters](#action-reference-all-inputoutput-parameters)
  - [Flowchart](#flowchart)
  - [Samples](#samples)
  - [Who is using `run-cmake`](#who-is-using-run-cmake)
- [License](#license)
- [Disclaimer](#disclaimer)
- [Contributing](#contributing)

# Quickstart with a C++ project template

Take a look at this [C++ project template](https://github.com/lukka/CppCMakeVcpkgTemplate/tree/v11) that applies all the following instructions, but also shows how to create a __pure__ workflow without using special GitHub action that you cannot run locally on your development machine, but directly using the tools (`CMake`, `Ninja`, `vcpkg`, `C++` compilers) you already use daily.

# [**run-cmake@v10** runs CMake with CMakePresets.json](https://github.com/marketplace/actions/run-cmake)

The **run-cmake** action runs [CMake](https://cmake.org) on GitHub workflows leveraging [CMakePresets.json](https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html). Note that usage of CMakePresets.json is required.

Good companions are the [run-vcpkg](https://github.com/marketplace/actions/run-vcpkg) action and the [get-cmake](https://github.com/marketplace/actions/get-cmake) action.

Special features which provide added value over a pure workflow are:
  - annotations for `CMake` errors/warnings and for build (`gcc`/`msvc`/`clang`) errors/warnings are created inline in the changed source files the build run for, e.g.:
    ![Annotation](./docs/imgs/annotation.png)
  - when necessary, it sets up the environment to build with the `MSVC` toolset.
  - automatic dump of log files created by `CMake` (e.g., `CMakeOutput.log`) and `vcpkg`. The content of those files flow into the workflow output log. The regex is customizable by the user.

The provided [samples](#samples) use [GitHub hosted runners](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/virtual-environments-for-github-hosted-runners).

Good companions are the [run-vcpkg](https://github.com/marketplace/actions/run-vcpkg) action and the
[get-cmake](https://github.com/marketplace/actions/get-cmake) action.

<br>

## Quickstart with instructions

It is __highly recommended__ to use:
- a [vcpkg.json](https://vcpkg.io/en/docs/maintainers/manifest-files.html) manifest file to declaratively specify the dependencies.
- the required [CMakePresets.json](https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html) file.
- [vcpkg as a submodule of your repository](https://github.com/microsoft/vcpkg/blob/master/README.md#vcpkg-as-a-submodule).

```yaml
jobs:
  build:
    steps:
      #-uses: actions/cache@v3   <===== YOU DO NOT NEED THIS!

      # Install latest CMake and Ninja.
      - uses: lukka/get-cmake@latest
      # Or pin to a specific CMake version:
      # lukka/get-cmake@v3.27

      # Setup vcpkg: ensures vcpkg is downloaded and built.
      # Since vcpkg.json is being used later on to install the packages
      # when `run-cmake` runs, no packages are installed at this time
      # (and vcpkg does not run).
      - name: Setup anew (or from cache) vcpkg (and does not build any package)
        uses: lukka/run-vcpkg@v11 # Always specify the specific _version_ of the
                                  # action you need, `v10` in this case to stay up
                                  # to date with fixes on the v11 branch.
        #with:
          # This is the default location of the directory containing vcpkg sources.
          # Change it to the right location if needed.
          # vcpkgDirectory: '${{ github.workspace }}/vcpkg'

          # If not using a submodule for vcpkg sources, this specifies which commit
          # id must be checkout from a Git repo.
          # Note: it must not be set if using a Git submodule for vcpkg.
          # vcpkgGitCommitId: '${{ matrix.vcpkgCommitId }}'

          # This is only needed if the command `vcpkg install` must run at this step.
          # Instead it is highly suggested to let `run-cmake` to run vcpkg later on
          # using the vcpkg.cmake toolchain. The default is `false`.
          # runVcpkgInstall: true

          # This is only needed if `runVpkgInstall` is `true`.
          # This glob expression used to locate the vcpkg.json and  use
          # its directory location as `working directory` when running `vcpkg install`.
          # Change it to match a single manifest file you want to use.
          # Note: do not use `${{ github.context }}` to compose the value as it
          # contains backslashes that would be misinterpreted. Instead
          # compose a value relative to the root of the repository using
          # `**/path/from/root/of/repo/to/vcpkg.json` to match the desired `vcpkg.json`.
          # vcpkgJsonGlob: '**/vcpkg.json'

      - name: Run CMake consuming CMakePreset.json and run vcpkg to build packages
        uses: lukka/run-cmake@v10
        with:
          # This is the default path to the CMakeLists.txt along side the
          # CMakePresets.json. Change if you need have CMakeLists.txt and CMakePresets.json
          # located elsewhere.
          # cmakeListsTxtPath: '${{ github.workspace }}/CMakeLists.txt'

          # You could use CMake workflow presets defined in the CMakePresets.json
          # with just this line below. Note this one cannot be used with any other
          # preset input, it is mutually exclusive.
          # workflowPreset: 'workflow-name'

          # This is the name of the CMakePresets.json's configuration to use to generate
          # the project files. This configuration leverages the vcpkg.cmake toolchain file to
          # run vcpkg and install all dependencies specified in vcpkg.json.
          configurePreset: 'ninja-multi-vcpkg'
          # Additional arguments can be appended to the cmake command.
          # This is useful to reduce the number of CMake's Presets since you can reuse
          # an existing preset with different variables.
          configurePresetAdditionalArgs: "['-DENABLE_YOUR_FEATURE=1']"

          # This is the name of the CMakePresets.json's configuration to build the project.
          buildPreset: 'ninja-multi-vcpkg'
          # Additional arguments can be appended when building, for example to specify the
          # configuration to build.
          # This is useful to reduce the number of CMake's Presets you need in CMakePresets.json.
          buildPresetAdditionalArgs: "['--config Release']"

          # This is the name of the CMakePresets.json's configuration to test the project with.
          testPreset: 'ninja-multi-vcpkg'
          # Additional arguments can be appended when testing, for example to specify the config
          # to test.
          # This is useful to reduce the number of CMake's Presets you need in CMakePresets.json.
          testPresetAdditionalArgs: "['--config Release']"

     #  [OPTIONAL] Define the vcpkg's triplet you want to enforce, otherwise the default one
    #  for the hosting system will be automatically choosen (x64 is the default on all
    #  platforms, e.g. `x64-osx`).
    #  VCPKG_DEFAULT_TRIPLET: ${{ matrix.triplet }}
    #
    #  [OPTIONAL] By default the action disables vcpkg's telemetry by defining VCPKG_DISABLE_METRICS.
    #  This behavior can be disabled by defining `VCPKG_ENABLE_METRICS` as follows.
    #  VCPKG_ENABLE_METRICS: 1
    #
```

<br>

## Action reference: all input/output parameters

Description of all input parameters:
[action.yml](https://github.com/lukka/run-cmake/blob/main/action.yml)

<br>

## Flowchart

Flowchart with related input in [action.yml](https://github.com/lukka/run-cmake/blob/main/action.yml) which let customize the flow.

```
┌───────────────────────────┐      ┌───────────────────────────┐
│ <if workflowPreset        │  Yes │ Run the workflow       `*`│  Inputs:
│ provided>                 ├─────►│ and then exit             │   - `cmakeListsTxtPath`
└─────────────┬─────────────┘      └─────────────┬─────────────┘   - `workflowPreset`
              │ No                               ⬬                 - `workflowPresetCmdString`
              ▼
┌──────────────────────────────────┐
│ <if configurePreset           `*`│     Inputs:
│ provided>                        |      - `cmakeListsTxtPath`
|                                  |      - `configurePreset`
│ $CONFIGURE_PRESET_NAME =         │      - `configurePresetCmdString`
│ configurePreset's value          │
| runs: `cmake --preset`           │
└─────────────┬────────────────────┘
              ▼
┌───────────────────────────────────┐
│ <if buildPreset provided>      `*`│     Inputs:
│                                   │     - `buildPreset`
│ $BUILD_PRESET_NAME=buildPreset    │     - `cmakeListsTxtPath`
│ runs: `cmake --build --preset`    │     - `buildPresetCmdString`
└─────────────┬─────────────────────┘     - `buildPresetAdditionalArgs`
              ▼
┌───────────────────────────────────┐
│ <if testPreset provided>       `*`│    Inputs:
│                                   │     - `testPreset`
│ $TEST_PRESET_NAME=testPreset      │     - `cmakeListsTxtPath`
│ runs: `ctest --preset`            │     - `testPresetCmdString`
└─────────────┬─────────────────────┘     - `testPresetAdditionalArgs`
              ▼
┌───────────────────────────────────┐
│ <if packagePreset provided>    `*`│    Inputs:
│                                   │     - `packagePreset`
│ $PACKAGE_PRESET_NAME=packagePreset│     - `cmakeListsTxtPath`
│ runs: `cpack --preset`            │     - `packagePresetCmdString`
└─────────────┬─────────────────────┘     - `packagePresetAdditionalArgs`
              ▼
              ⬬ END


  `*` On Windows runners, the MSVC environment is setup for each block
   with the `*` on the top right corner. Note that VCPKG_ROOT will not be
   overridden by the value defined in the VS Developer Command Prompt
   environment, but the original value will be kept.
 ┌───────────────────────────┐
 │ <if VCPKG_ROOT defined    │  Inputs:
 │ and CC and CXX undefined> │   - `runVcpkgEnvFormatString`
 │ run `vcpkg env` to set    │   - `configurePresetAdditionalArgs`
 │ the environment for MSVC  │
 └───────────────────────────┘
```

<br>

## Samples

_Checkmarks_ indicates whether the samples "uses" or specifies the thing in the header or whether it is true.

|workflow link|`vcpkg` as submodule|explicit triplet|`vcpkg` toolchain|`CMake`'s Presets|`Ninja`|`run-vcpkg` runs vcpkg|`CMake` runs `vcpkg`
|:-|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|[link](https://github.com/lukka/CppBuildTasks-Validation/blob/v10/.github/workflows/hosted-ninja-vcpkg_submod.yml)|✅|❌|✅|✅|✅|❌|✅|
|[link](https://github.com/lukka/CppBuildTasks-Validation/blob/v10/.github/workflows/hosted-ninja-vcpkg.yml)|❌|❌|✅|✅|✅|❌|✅
|[link](https://github.com/lukka/CppBuildTasks-Validation/blob/v10/.github/workflows/hosted-ninja-vcpkg-install.yml)|❌|❌|✅|✅|✅|✅|❌|
|[link](https://github.com/lukka/CppBuildTasks-Validation/blob/v10/.github/workflows/hosted-ninja-vcpkg_submod-triplet.yml)|✅|✅|✅|✅|✅|❌|✅

<br>

## Who is using `run-cmake`

[This graph](https://lukka.github.io/graph/graph.html) shows the list of public repositories with more than 25 stars using `run-cmake`.

<br>

# License

All the content in this repository is licensed under the [MIT License](LICENSE.txt).

Copyright © 2019-2020-2021-2022-2023 Luca Cappa

<br>

# Disclaimer

The software is provided as is, there is no warranty of any kind. All users are encouraged to improve the [source code](https://github.com/lukka/run-cmake) with fixes and new features.

<br>

# Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md)

