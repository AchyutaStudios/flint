#!/usr/bin/env node

import { Command } from "commander";
import * as packageJson from '../package.json';
import * as svg from './svg/svg'

const program = new Command('flint');

program
    .name(packageJson.name)
    .description(packageJson.description)
    .version(packageJson.version);

program
    .command("svg2png")
    .description('Converts all SVGs in input folder to PNG.')
    .option('-i, --input [path]', 'Input Asset Folder', 'assetSrc')
    .option('-o, --output [path]', 'Output Asset Folder', 'assets')
    .action((options) => {
        svg.svg2png(options.input, options.output)
    });

program.parse();