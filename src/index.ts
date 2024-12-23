#!/usr/bin/env node

import { Command } from 'commander';
import * as packageJson from '../package.json';
import * as svg from './svg/svg'

const program = new Command('flint');

program
    .name(packageJson.name)
    .description(packageJson.description)
    .version(packageJson.version);

program
    .command("svg-to-png")
    .description('Converts all SVGs in input folder to PNG.')
    .option('-i, --input [path]', 'Input Asset Folder', 'assets_src')
    .option('-o, --output [path]', 'Output Asset Folder', 'assets')
    .action((options) => {
        svg.svgToPng(options.input, options.output)
    });

program
    .command("watch-svg")
    .description('watches any changes in SVGs in input folder and converts it to PNG.')
    .option('-i, --input [path]', 'Input Asset Folder', 'assets_src')
    .option('-o, --output [path]', 'Output Asset Folder', 'assets')
    .option('--ignoreInitial [boolean]', 'Ignore Initial file watching.', "true")
    .action((options) => {
        svg.watchSvg(options.input, options.output, options.ignoreInitial)
    });

program.parse();