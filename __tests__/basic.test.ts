import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as io from '@actions/io'

const buildDirectory = path.join(__dirname, "buildDirectory");
const tempDirectory = path.join(__dirname, "tempDirectory");

describe('basic run-cmake tests', () => {
    beforeEach(async () => {
        await io.rmRF(buildDirectory);
        await io.rmRF(tempDirectory);
        await io.mkdirP(buildDirectory);
        await io.mkdirP(tempDirectory);
    }, 300000);

    afterAll(async () => {
        try {
            await io.rmRF(buildDirectory);
            await io.rmRF(tempDirectory);
        } catch {
            console.log('Failed to remove test directories');
        }
    }, 100000);

    it('basic test for CMakeListsTxtBasic', async () => {
        process.env['INPUT_CMAKELISTSORSETTINGSJSON'] = 'CMakeListsTxtBasic';
        process.env['INPUT_BUILDDIRECTORY'] = buildDirectory;
        process.env['INPUT_CMAKEGENERATOR'] = 'Ninja';
        process.env['INPUT_CMAKEBUILDTYPE'] = 'Release';
        process.env['INPUT_CMAKELISTSTXTPATH'] = path.join(__dirname, 'assets', 'CMakeLists.txt');
        const ip = path.join(__dirname, '..', 'dist', 'index.js');
        const options: cp.ExecSyncOptions = {
            env: process.env,
            stdio: "inherit"
        };
        console.log(cp.execSync(`node ${ip}`, options)?.toString());
    });

    it('basic test for CMakeListsTxtAdvanced', async () => {
        process.env['INPUT_CMAKELISTSORSETTINGSJSON'] = 'CMakeListsTxtAdvanced';
        process.env['INPUT_BUILDDIRECTORY'] = buildDirectory;
        process.env['INPUT_CMAKELISTSTXTPATH'] = path.join(__dirname, 'assets', 'CMakeLists.txt');
        const ip = path.join(__dirname, '..', 'dist', 'index.js');
        const options: cp.ExecSyncOptions = {
            env: process.env,
            stdio: "inherit"
        };
        console.log(cp.execSync(`node ${ip}`, options)?.toString());
    });

    it('basic test for CMakeSettingsJson', async () => {
        process.env['INPUT_CMAKELISTSORSETTINGSJSON'] = 'CMakeSettingsJson';
        process.env['INPUT_BUILDDIRECTORY'] = buildDirectory;
        process.env['INPUT_CONFIGURATIONREGEXFILTER'] = '.*inux.*';
        process.env['INPUT_CMAKESETTINGSJSONPATH'] = path.join(__dirname, 'assets', 'CMakeSettings.json');
        process.env['GITHUB_WORKSPACE'] = tempDirectory;
        const ip = path.join(__dirname, '..', 'dist', 'index.js');
        const options: cp.ExecSyncOptions = {
            env: process.env,
            stdio: "inherit"
        };
        console.log(cp.execSync(`node ${ip}`, options)?.toString());
    })

});