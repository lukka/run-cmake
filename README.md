[![Action Status](https://github.com/lukka/run-cmake/workflows/build-test/badge.svg)](https://github.com/lukka/run-cmake/actions)

[![Coverage Status](https://coveralls.io/repos/github/lukka/run-cmake/badge.svg?branch=main)](https://coveralls.io/github/lukka/run-cmake?branch=main)

- [Before using this action, consider writing a C++/CMake/vcpkg based _pure_ workflow!](#before-using-this-action-consider-writing-a-ccmakevcpkg-based-pure-workflow)
- [The **run-cmake@v10** action for using CMake with CMakePreset.json on GitHub workflows](#the-run-cmakev10-action-for-using-cmake-with-cmakepresetjson-on-github-workflows)
  - [Quickstart](#quickstart)
  - [Action reference: all input/output parameters](#action-reference-all-inputoutput-parameters)
  - [Flowchart](#flowchart)
  - [Samples](#samples)
- [License](#license)
- [Disclaimer](#disclaimer)
- [Contributing](#contributing)

# Before using this action, consider writing a [C++/CMake/vcpkg based _pure_ workflow](https://github.com/lukka/CppBuildTasks-Validation/blob/master/.github/workflows/hosted-pure-workflow.yml)!

A __pure__ workflow is one without using special GitHub action that you cannot run locally on your development machine, but directly using the tools (`CMake`, `Ninja`, `vcpkg`) you already use daily.
You can read more in this issue about it: https://github.com/lukka/run-cmake/issues/41

# [The **run-cmake@v10** action for using CMake with CMakePreset.json on GitHub workflows](https://github.com/marketplace/actions/run-cmake)

The **run-cmake** action runs [CMake](https://cmake.org) on GitHub workflows by leveraging the configurations specified into [CMakePreset.json](https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html).

Good companions are the [run-vcpkg](https://github.com/marketplace/actions/run-vcpkg) action and the [get-cmake](https://github.com/marketplace/actions/get-cmake) action.

Special features which provide added value over a pure workflow are:
  - automatic dump of log files created by `CMake` (e.g., `CMakeOutput.log`) and `vcpkg`. The content of those files flow into the workflow output log. Customizable by the user.
  - annotations for `CMake` errors/warnings and for build (`gcc`/`msvc`/`clang`) errors/warning are created inline in the changed source files the build run for, e.g.: ![Annotation](./docs/imgs/annotation.png)
  - when necessary, it sets the environment to build with the MSVC toolset.

The provided [samples](#samples) use [GitHub hosted runners](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/virtual-environments-for-github-hosted-runners).

## Quickstart

It is __highly recommended__ to use:
- [vcpkg as a submodule](#vcpkgsubmodule).
- a [vcpkg.json](#vcpkgjson) manifest file to declaratively specify the dependencies.
- a CMakePreset.json file.

```yaml
jobs:
  build:
    steps:
      #-uses: actions/cache@v1   <===== YOU DO NOT NEED THIS!

      # Install latest CMake.
      - uses: lukka/get-cmake@latest
      # Or pin to a specific CMake version:
      # lukka/get-cmake@v3.21.2

      # Restore from cache the previously built ports. If a "cache miss" occurs,
      # then vcpkg is bootstrapped. Since a the vcpkg.json is being used later on
      # to install the packages when `run-cmake` runs, no packages are installed at
      # this time.
      - name: Restore artifacts, or setup vcpkg (do not install any package)
        uses: lukka/run-vcpkg@v10 # Always specify the specific _version_ of the action you need, `v10` in this case.
        #with:
          # This is the default location of the directory containing vcpkg sources.
          # Change it to the right location if needed.
          # vcpkgDirectory: '${{ github.workspace }}/vcpkg'

          # If not using a submodule for vcpkg sources, this specifies which commit
          # id must be checkout from a Git repo. It must not set if using a submodule
          # for vcpkg.
          # vcpkgGitCommitId: '${{ matrix.vcpkgCommitId }}'

          # This is the glob expression used to locate the vpkg.json and add its
          # hash to the cache key. Change it to match a single manifest file you want
          # to use.
          # vcpkgJsonGlob: '**/vcpkg.json'

          # This is needed to run `vcpkg install` command (after vcpkg is built) in
          # the directory where vcpkg.json has been located. Default is false,
          # It is highly suggested to let `run-cmake` to run vcpkg (i.e. `false`)
          # (i.e. let CMake run `vcpkg install`) using the vcpkg.cmake toolchain.
          # runVcpkgInstall: true

      - name: Run CMake consuming CMakePreset.json and vcpkg.json by mean of vcpkg.
        uses: lukka/run-cmake@v10
        with:
          # This is the default path to the CMakeLists.txt along side the
          # CMakePresets.json. Change if you need have CMakeLists.txt and CMakePresets.json
          # located elsewhere.
          # cmakeListsTxtPath: '${{ github.workspace }}/CMakeLists.txt'

          # This is the name of the CMakePresets.json's configuration to use to generate
          # the project files. This configuration leverages the vcpkg.cmake toolchain file to
          # run vcpkg and install all dependencies specified in vcpkg.json.
          configurePreset: 'ninja-multi-vcpkg'

          # This is the name of the CMakePresets.json's configuration to build the project.
          buildPreset: 'ninja-multi-vcpkg'
```

## Action reference: all input/output parameters

Description of all input parameters:
[action.yml](https://github.com/lukka/run-cmake/blob/main/action.yml)


## Flowchart

Flowchart with related input in [action.yml](https://github.com/lukka/run-cmake/blob/main/action.yml) which let customize the flow.

```
┌───────────────────────────┐      ┌───────────────────────────┐
│ <if configurePreset       │  Yes │ <if VCPKG_ROOT defined    │  Inputs:
│ provided>                 ├─────►│ and CC and CXX undefined> │   - `runVcpkgEnvFormatString`
└─────────────┬─────────────┘      │ run `vcpkg env` to set    │
              │ No                 │ the environment for MSVC  │
              │                    └─────────────┬─────────────┘
              │                                  ▼
              │                    ┌───────────────────────────┐  Inputs:
              ├────────────────────┤ run `cmake --preset`      │   - `cmakeListsTxtPath`
              │                    └───────────────────────────┘   - `configurePreset`
              │                                                    - `configurePresetCmdString`
              │
              ▼
┌──────────────────────────┐
│ <if buildPreset provided>│    Inputs:
│                          │     - `cmakeListsTxtPath`
│ run                      │     - `buildPreset`
│ `cmake --build --preset` │     - `buildPresetCmdString`
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ <if testPreset provided> │    Inputs:
│                          │     - `cmakeListsTxtPath`
│ run                      │     - `testPreset`
│ `ctest --preset`         │     - `testPresetCmdString`
└─────────────┬────────────┘
              │
              ▼
              ⬬
```

## Samples

|Sample scenario|Notes|
|:-:|:-:|
|[vcpkg as submodule, CMake with vcpkg toolchain in a CMakePreset.json configuration](https://github.com/lukka/CppBuildTasks-Validation/blob/v10/.github/workflows/hosted-ninja-vcpkg_submod.yml)| Uses `CMake`, `Ninja` and `vcpkg`|
|[vcpkg NOT as submodule, CMake with vcpkg toolchain in a CMakePreset.json configuration](https://github.com/lukka/CppBuildTasks-Validation/blob/v10/.github/workflows/hosted-ninja-vcpkg_submod.yml)|Uses `CMake`, `Ninja` and `vcpkg`|
|[`run-vcpkg` runs 'vcpkg install' (by default it is not)](https://github.com/lukka/CppBuildTasks-Validation/blob/v10/.github/workflows/hosted-ninja-vcpkg-install.yml)|Uses `CMake`, `Ninja` and `vcpkg`|

<br>

# License

All the content in this repository is licensed under the [MIT License](LICENSE.txt).

Copyright © 2019-2020-2021 Luca Cappa

# Disclaimer

The software is provided as is, there is no warranty of any kind. All users are encouraged to improve the [source code](https://github.com/lukka/run-cmake) with fixes and new features.

# Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md)

