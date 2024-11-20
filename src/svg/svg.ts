import { glob } from 'glob';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import chalk from 'chalk';
import chokidar from 'chokidar';

export async function svg2png(inputDir: string, outputDir: string) {
    const svgFiles = await glob(`${inputDir}/**/*.svg`);
    console.log(chalk.green(`Found ${svgFiles.length} SVG file(s) for conversion.`));

    svgFiles.map(async (item) => {
        await convertSvg2Png(item, inputDir, outputDir);
    });

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Converted ${svgFiles.length} SVG file(s).\n`);
    console.log(chalk.green('Completed SVG Conversion.'));
}

export function watchSvg(inputDir:string, outputDir: string, ignoreInitial: string) {
    var ignore = false
    if (ignoreInitial === "true") {
        ignore = true
    }

    const watcher = chokidar.watch(`${inputDir}`, {
        persistent: true,
        ignoreInitial: ignore
    });
    
    watcher
        .on('add', async (svgPath) => {
            if (svgPath.endsWith('.svg')) {
                console.log(chalk.yellow(`SVG file added: ${svgPath}`));
                await convertSvg2Png(svgPath, inputDir, outputDir, true);
            }
        })
        .on('change', (svgPath) => {
            if (svgPath.endsWith('.svg')) {
                console.log(chalk.yellow(`SVG file changed: ${svgPath}`));
                convertSvg2Png(svgPath, inputDir, outputDir, true);
            }
        })
        .on('unlink', (svgPath) => {
            if (svgPath.endsWith('.svg')) {
                console.log(chalk.yellow(`SVG file removed: ${svgPath}`));
                const outputPath = `${outputDir}\\${path.relative(inputDir, svgPath)}`.replace('.svg', '.png');
                if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                    console.log(`PNG file removed: ${outputPath}`);
                }
            }
        })
        .on('error', (error) => {
            console.error(chalk.red('Error watching files:'), error);
        });
    
    console.log(chalk.blueBright('Watching for changes to SVG files...'));
}

async function convertSvg2Png(svgPath: string, inputDir: string, outputDir: string, watcher: boolean = false): Promise<void> {
    const outputPath = `${outputDir}\\${path.relative(inputDir, svgPath)}`;
    const doubleSlashPath = outputPath.replace(/\\/g, '\\\\');

    if (!fs.existsSync(path.dirname(doubleSlashPath))) {
        await fs.promises.mkdir(path.dirname(doubleSlashPath), { recursive: true });
    }

    return new Promise((resolve, reject) => {
        sharp(svgPath)
            .png()
            .toFile(outputPath.replace('.svg', '.png'), (err, info) => {
                if (err) {
                    console.error(chalk.red(`Error converting file ${svgPath} to PNG:`), err);
                    reject(err);
                } else {
                    if (watcher) console.log(`Successfully converted ${svgPath} to png`);
                    else process.stdout.write(`Successfully converted ${svgPath} to png\r`);
                    resolve();
                }
            });
    });
}