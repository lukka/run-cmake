[![Action Status](https://github.com/lukka/run-cmake/workflows/build/badge.svg)](https://github.com/lukka/run-cmake/actions)

# [The **run-cmake** action for using CMake on GitHub](https://github.com/marketplace/actions/run-cmake)

Build C++ software with the multi-platform **run-cmake** action by running [CMake](https://cmake.org) on GitHub workflows. [Samples](#samples) provided use [GitHub hosted runners](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/virtual-environments-for-github-hosted-runners) and [Caching](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/caching-dependencies-to-speed-up-workflows).

A good companion is the [run-vcpkg](https://github.com/marketplace/actions/run-vcpkg) action.

 ## User Manual
 * [Quickstart](#quickstart)
 * [The <strong>run-cmake</strong> action](#run-cmake)
 * [Action reference: all input/output parameters](#reference)
 * [Samples](#samples)
 * [Projects](#projects)

 ## Developer Manual
 * [Developers information](#developers-information)
   * [Prerequisites](#prerequisites)
   * [Packaging](#packaging)
   * [Testing](#testing)
  * [Contributing](#contributing)
  * [License](#license)

## <a id='quickstart'>Quickstart</a>

It is __highly recommended__ to [use vcpkg as a submodule](https://github.com/lukka/CppBuildTasks/blob/master/README.md#use-vcpkg-as-a-submodule-of-your-git-repository). Here below the sample where vcpkg is a Git submodule:

```yaml
  # Sample when vcpkg is a submodule of your repository (highly recommended!)

    # Cache/Restore the vcpkg's build artifacts.
    - name: Cache vcpkg's artifacts
      uses: actions/cache@v1
      with:
        path: ${{ github.workspace }}/vcpkg/
        # The key will be different each time a different version of vcpkg is used, or different ports are installed.
        key: ${{ hashFiles( env.vcpkgResponseFile ) }}-${{ hashFiles('.git/modules/vcpkg/HEAD') }}-${{ runner.os }}

    - name: Run vcpkg
      uses: lukka/run-vcpkg@v0
      with:
       # Response file stored in source control, it provides the list of ports and triplet(s).
        vcpkgArguments: '@${{ env.vcpkgResponseFile }}'
       # Location of the vcpkg as submodule of the repository.
        vcpkgDirectory: '${{ github.workspace }}/vcpkg'

    - name: 'Run CMake with Ninja'
      uses: lukka/run-cmake@v0
      with:
        cmakeListsOrSettingsJson: CMakeListsTxtAdvanced
        cmakeListsTxtPath: '${{ github.workspace }}/cmakesettings.json/CMakeLists.txt'
        useVcpkgToolchainFile: true
        buildDirectory: '${{ runner.workspace }}/b//unixmakefiles'
        cmakeAppendedArgs: '-G "Ninja" '
        # Or build multiple configurations out of a CMakeSettings.json file created with Visual Studio.
        # cmakeListsOrSettingsJson: CMakeSettingsJson
        # cmakeSettingsJsonPath: '${{ github.workspace }}/cmakesettings.json/CMakeSettings.json'
        # configurationRegexFilter: '${{ matrix.configuration }}'
```

## <a id='run-cmake'>The ***run-cmake*** action</a>

This action behaves the same way as it does the [run-cmake](https://marketplace.visualstudio.com/items?itemName=lucappa.cmake-ninja-vcpkg-tasks) task for Azure DevOps.

The documentation of the **'run-cmake"** action is identical to the [**'run-cmake'** task's one](https://github.com/lukka/CppBuildTasks/blob/master/README.md#runcmake
) for Azure DevOps.

### <a id='reference'>Action reference: all input/output parameters</a>

[action.yml](https://github.com/lukka/run-cmake/blob/v0/action.yml)

## <a id="samples">Samples</a>

[View the workflows based on the run-cmake and run-vcpkg actions](https://github.com/lukka/CppBuildTasks-Validation/actions).

|CMakeLists.txt samples | |
|----------|-------|
[Linux/macOS/Windows, hosted runner, basic](https://github.com/lukka/CppBuildTasks-Validation/blob/master/.github/workflows/hosted-basic.yml)| [![Actions Status](https://github.com/lukka/CppBuildTasks-Validation/workflows/hosted-basic/badge.svg)](https://github.com/lukka/CppBuildTasks-Validation/actions)
[Linux/macOS/Windows, hosted runner, advanced](https://github.com/lukka/CppBuildTasks-Validation/blob/master/.github/workflows/hosted-advanced.yml)| [![Actions Status](https://github.com/lukka/CppBuildTasks-Validation/workflows/hosted-advanced/badge.svg)](https://github.com/lukka/CppBuildTasks-Validation/actions)
[Linux/macOS/Windows, hosted runner, with cache and vcpkg as submodule](https://github.com/lukka/CppBuildTasks-Validation/blob/master/.github/workflows/hosted-basic-cache-submod_vcpkg.yml)| [![Actions Status](https://github.com/lukka/CppBuildTasks-Validation/workflows/hosted-basic-cache-submod_vcpkg/badge.svg)](https://github.com/lukka/CppBuildTasks-Validation/actions)

|CMakeSettings.json samples | |
|----------|-------|
[Linux/macOS/Windows, hosted runner, with cache and vcpkg as submodule](https://github.com/lukka/CppBuildTasks-Validation/blob/master/.github/workflows/hosted-cmakesettingsjson-cache-submod_vcpkg.yml)| [![Actions Status](https://github.com/lukka/CppBuildTasks-Validation/workflows/hosted-cmakesettingsjson-cache-submod_vcpkg/badge.svg)](https://github.com/lukka/CppBuildTasks-Validation/actions)

## <a id='projects'>Real world project samples</a>

project: [CppOpenGLWebAssemblyCMake](https://github.com/lukka/CppOpenGLWebAssemblyCMake) | |
|----------|-------|
[WASM, Linux, macOS](https://github.com/lukka/CppOpenGLWebAssemblyCMake/blob/master/.github/workflows/build.yml) | [![Actions Status](https://github.com/lukka/CppOpenGLWebAssemblyCMake/workflows/hosted-wasm-macos-linux/badge.svg)](https://github.com/lukka/CppOpenGLWebAssemblyCMake/actions)


project: [quiniouben/vban](https://github.com/quiniouben/vban/) | | 
|----------|-------|
[Windows, Linux](https://github.com/quiniouben/vban/blob/master/.github/workflows/main.yml) | [![CI](https://github.com/quiniouben/vban/workflows/CI/badge.svg)](https://github.com/quiniouben/vban/actions)

# Developers information

## Prerequisites
[gulp 4](https://www.npmjs.com/package/gulp4) globally installed.

## Build and lint
Build with `tsc` running:

 > npm run build

Launch `lint` by:

 > npm run lint

## Packaging
To build, lint validate and package the extension for release purpose, run:

  > npm run pack

## Testing

To build, pack and test:
 
 > npm run test

 To run test directly:
 
 > jest

[Smoke tests](https://en.wikipedia.org/wiki/Smoke_testing_(software)) are implemented in this repository, which run the action on all platforms.

Rigorous tests are executed in the builds of [CppBuildTasks](https://github.com/lukka/CppBuildTasks/) repository that shares the same engine in the [run-cmake-vcpkg-action-libs](https://github.com/lukka/run-cmake-vcpkg-action-libs) submodule.

It would be desirable to have extensive tests implemented in this repository as well.

Validation tests on various scenarios are run using the workflows of the [Samples](#samples).

## <a id='contributing'>Contributing</a>

The software is provided as is, there is no warranty of any kind. All users are encouraged to improve the [source code](https://github.com/lukka/run-cmake) with fixes and new features.

# License
All the content in this repository is licensed under the [MIT License](LICENSE.txt).

Copyright (c) 2019-2020 Luca Cappa
