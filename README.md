[![Action Status](https://github.com/lukka/run-cmake/workflows/build-test/badge.svg)](https://github.com/lukka/run-cmake/actions)

# [The **run-cmake** action for using CMake on GitHub](https://github.com/marketplace/actions/run-cmake)

Build C++ software with the multi-platform **run-cmake** action by running [CMake](https://cmake.org) on GitHub workflows. [Samples](#samples) provided use [GitHub hosted runners](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/virtual-environments-for-github-hosted-runners) and [Caching](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/caching-dependencies-to-speed-up-workflows).

Good companions are the [run-vcpkg](https://github.com/marketplace/actions/run-vcpkg) action and the [get-cmake](https://github.com/marketplace/actions/get-cmake) action.

 ## User Manual
 * [Quickstart](#quickstart)
    * [Flowchart](#flowchart)
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

It is __highly recommended__ to [use vcpkg as a submodule](https://github.com/lukka/run-vcpkg/#best-practices). Here below the sample where vcpkg is stored in a Git submodule:

```yaml
  # Sample when vcpkg is a submodule of your repository (highly recommended!)

    # Cache/Restore the vcpkg's build artifacts.
    - name: Run vcpkg
      uses: lukka/run-vcpkg@v4
      with:
       # Response file stored in source control, it provides the list of ports and triplet(s).
        vcpkgArguments: '@${{ env.vcpkgResponseFile }}'
       # Location of the vcpkg as submodule of the repository.
        vcpkgDirectory: '${{ github.workspace }}/vcpkg'

    - name: 'Run CMake with Ninja'
      uses: lukka/run-cmake@v3
      with:
        cmakeListsOrSettingsJson: CMakeListsTxtAdvanced
        cmakeListsTxtPath: '${{ github.workspace }}/cmakesettings.json/CMakeLists.txt'
        useVcpkgToolchainFile: true
        buildDirectory: '${{ runner.workspace }}/b//unixmakefiles'
        cmakeAppendedArgs: '-GNinja '
        # Or build multiple configurations out of a CMakeSettings.json file created with Visual Studio.
        # cmakeListsOrSettingsJson: CMakeSettingsJson
        # cmakeSettingsJsonPath: '${{ github.workspace }}/cmakesettings.json/CMakeSettings.json'
        # configurationRegexFilter: '${{ matrix.configuration }}'
```
### <a id='flowchart'>Flowchart</a>

![run-cmake flowchart](https://raw.githubusercontent.com/lukka/run-cmake-vcpkg-action-libs/main/packages/run-cmake-lib/docs/task-cmake.png
)

## <a id='run-cmake'>The ***run-cmake*** action</a>

This action behaves the same way as it does the [run-cmake](https://marketplace.visualstudio.com/items?itemName=lucappa.cmake-ninja-vcpkg-tasks) task for Azure DevOps.

The documentation of the **'run-cmake"** action is identical to the [**'run-cmake'** task's one](https://github.com/lukka/CppBuildTasks/blob/master/README.md#runcmake
) for Azure DevOps.

Features available only in the GitHub version of **'run-cmake'**:
 
  -  Annotations for CMake errors/warnings and for build (gcc/msvc/clang) errors/warning are created inline in the changed source files the build run for, e.g.:
![Annotation](./docs/imgs/annotation.png)

## <a id='reference'>Action reference: all input/output parameters</a>

[action.yml](https://github.com/lukka/run-cmake/blob/main/action.yml)

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
|Project|Platform(s)| |
|----------|-------|-|
|[CppOpenGLWebAssemblyCMake](https://github.com/lukka/CppOpenGLWebAssemblyCMake) |[WASM/Linux/macOS](https://github.com/lukka/CppOpenGLWebAssemblyCMake/blob/master/.github/workflows/build.yml) | [![Actions Status](https://github.com/lukka/CppOpenGLWebAssemblyCMake/workflows/hosted-wasm-macos-linux/badge.svg)](https://github.com/lukka/CppOpenGLWebAssemblyCMake/actions)
|[quiniouben/vban](https://github.com/quiniouben/vban/) | [Windows/Linux](https://github.com/quiniouben/vban/blob/master/.github/workflows/main.yml) | [![CI](https://github.com/quiniouben/vban/workflows/CI/badge.svg)](https://github.com/quiniouben/vban/actions)
|[OPM/ResInsight](https://github.com/OPM/ResInsight/) | [Windows/Linux](https://github.com/OPM/ResInsight/blob/dev/.github/workflows/main.yml) | [![CI](https://github.com/OPM/ResInsight/workflows/ResInsight%20Build/badge.svg)](https://github.com/OPM/ResInsight/actions)
|[iovw/Notepad--](https://github.com/iovw/Notepad--/) | [Windows](https://github.com/iovw/Notepad--/blob/master/.github/workflows/ccpp.yml) | [![CI](https://github.com/iovw/Notepad--/workflows/C/C++%20CI/badge.svg)](https://github.com/iovw/Notepad--/actions)
|[Mudlet/Mudlet](https://github.com/Mudlet/Mudlet) | [Linux/macOS](https://github.com/Mudlet/Mudlet/blob/development/.github/workflows/build-mudlet.yml) | [![Build Mudlet](https://github.com/Mudlet/Mudlet/workflows/Build%20Mudlet/badge.svg)](https://github.com/Mudlet/Mudlet/actions) 
|[otland/forgottenserver](https://github.com/otland/forgottenserver) | [Linux/macOS/Windows](https://github.com/otland/forgottenserver/blob/master/.github/workflows/build-vcpkg.yml) | [![Build with vcpkg](https://github.com/otland/forgottenserver/workflows/Build%20with%20vcpkg/badge.svg)](https://github.com/otland/forgottenserver/actions)
|[Element-0/ElementZero](https://github.com/Element-0/ElementZero) | [Windows](https://github.com/Element-0/ElementZero/blob/master/.github/workflows/ci.yml) | [![CI](https://github.com/Element-0/ElementZero/workflows/CI/badge.svg)](https://github.com/Element-0/ElementZero/actions)
|[assimp/assimp](https://github.com/assimp/assimp) |[Linux/macOS/Windows](https://github.com/assimp/assimp/blob/master/.github/workflows/ccpp.yml) | [![C/C++ CI](https://github.com/assimp/assimp/workflows/C/C++%20CI/badge.svg)](https://github.com/assimp/assimp/actions)
|[sony/nmos-cpp](https://github.com/sony/nmos-cpp) | [Linux/macOS/Windows](https://github.com/sony/nmos-cpp/blob/master/.github/workflows/build-test.yml) | [![build-test](https://github.com/sony/nmos-cpp/workflows/build-test/badge.svg)](https://github.com/sony/nmos-cpp/actions)
|[RaftLib/RaftLib](https://github.com/RaftLib/RaftLib) | [Linux/macOS/Windows](https://github.com/RaftLib/RaftLib/blob/master/.github/workflows/main.yml) | [![CI](https://github.com/RaftLib/RaftLib/workflows/CI/badge.svg)](https://github.com/RaftLib/RaftLib/actions)
|[zealdocs/zeal](https://github.com/zealdocs/zeal) | [Linux/Windows](https://github.com/zealdocs/zeal/blob/master/.github/workflows/build-check.yml) | [![Build Check](https://github.com/zealdocs/zeal/workflows/Build%20Check/badge.svg)](https://github.com/zealdocs/zeal/actions)
|[marian-nmt/marian-dev](https://github.com/marian-nmt/marian-dev) | [Windows](https://github.com/marian-nmt/marian-dev/blob/master/.github/workflows/windows.yml)/[Linux](https://github.com/marian-nmt/marian-dev/blob/master/.github/workflows/ubuntu.yml)/[macOS](https://github.com/marian-nmt/marian-dev/blob/master/.github/workflows/macos.yml)|[![Windows](https://github.com/marian-nmt/marian-dev/workflows/Windows/badge.svg)](https://github.com/marian-nmt/marian-dev/actions/) [![Linux](https://github.com/marian-nmt/marian-dev/workflows/Ubuntu/badge.svg)](https://github.com/marian-nmt/marian-dev/actions/) [![macOS](https://github.com/marian-nmt/marian-dev/workflows/MacOS/badge.svg)](https://github.com/marian-nmt/marian-dev/actions/) 
|[GrinPlusPlus](https://github.com/GrinPlusPlus/GrinPlusPlus) | [Linux/Windows/macOS](https://github.com/GrinPlusPlus/GrinPlusPlus/blob/master/.github/workflows/ci.yml) | [![ci](https://github.com/GrinPlusPlus/GrinPlusPlus/workflows/ci/badge.svg)](https://github.com/GrinPlusPlus/GrinPlusPlus/actions/)

# Developers information

## Prerequisites
[gulp 4](https://www.npmjs.com/package/gulp4) globally installed.

### Setup for GitHub Registry public packages

`run-vcpkg` depends on public NPM packages published by [lukka/run-cmake-vcpkg-action-libs](https://github.com/lukka/run-cmake-vcpkg-action-libs) in the [GitHub Packages registry](https://docs.github.com/en/free-pro-team@latest/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages).
Unexpectedly, a public package still requires authentication when downloading it, hence if you want to `npm install` those packages correctly, you need to obtain a token with `read:packages` scope. Then create in the root of the repository a `.npmrc` file with the following content:

   //npm.pkg.github.com/:_authToken=YOURTOKEN
   @lukka:registry=https://npm.pkg.github.com/

__Note__: **Never commit this `.npmrc` file!**

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

Validation tests on various scenarios are run using the workflows of the [Samples](#samples).

## <a id='contributing'>Contributing</a>

The software is provided as is, there is no warranty of any kind. All users are encouraged to improve the [source code](https://github.com/lukka/run-cmake) with fixes and new features.

# License
All the content in this repository is licensed under the [MIT License](LICENSE.txt).

Copyright (c) 2019-2020 Luca Cappa

# Donating

Other than submitting a pull request, [donating](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=EGNDRPRXM62G2&source=url) is another way to contribute to this project.