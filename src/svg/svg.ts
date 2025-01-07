import { glob } from 'glob';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import chalk from 'chalk';
import chokidar from 'chokidar';

sharp.cache(false)

export async function svgToPng(inputDir: string, outputDir: string, scale: GLfloat = 1) {
    const svgFiles = await glob(`${inputDir}/**/*.svg`);
    console.log(chalk.blueBright(`Found ${svgFiles.length} SVG file(s) for conversion.`));

    await Promise.all(svgFiles.map(async (item) => {
        await convertSvgToPng(item, inputDir, outputDir, scale);
    }));

    console.log(chalk.blueBright('Completed SVG Conversion.'));
}

export function watchSvg(inputDir:string, outputDir: string, scale: GLfloat ,ignoreInitial: string) {
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
                await convertSvgToPng(svgPath, inputDir, outputDir, scale, true);
            }
        })
        .on('change', (svgPath) => {
            if (svgPath.endsWith('.svg')) {
                convertSvgToPng(svgPath, inputDir, outputDir, scale, true);
            }
        })
        .on('unlink', (svgPath) => {
            if (svgPath.endsWith('.svg')) {
                const outputPath = `${outputDir}\\${path.relative(inputDir, svgPath)}`.replace('.svg', '.png');
                if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                    const s = "PNG Removed".padStart(25)
                    console.log(`${chalk.green.bold("PNG Removed".padStart(15))} ${outputPath}`);
                }
            }
        })
        .on('error', (error) => {
            console.error(chalk.red('Error watching files:'), error);
        });
    
    console.log(chalk.blueBright('Watching for changes to SVG files...'));
}

async function convertSvgToPng(
    svgPath: string, inputDir: string, outputDir: string, 
    scale: GLfloat = 1 ,watcher: boolean = false): Promise<void> {

    const outputPath = `${outputDir}\\${path.relative(inputDir, svgPath)}`.replace('.svg', '.png');
    const doubleSlashPath = outputPath.replace(/\\/g, '\\\\');

    if (!fs.existsSync(path.dirname(doubleSlashPath))) {
        await fs.promises.mkdir(path.dirname(doubleSlashPath), { recursive: true });
    }

    return new Promise((resolve, reject) => {
        sharp(svgPath)
            .metadata()
            .then((metadata) => {
                const scaledWidth = metadata.width ? Math.round(metadata.width * scale) : null;
                const scaledHeight = metadata.height ? Math.round(metadata.height * scale) : null;

                if (scaledWidth === null || scaledHeight === null) {
                    console.error(chalk.red("Error: SVG metadata width or height is undefined."));
                    return reject(new Error("SVG metadata width or height is undefined."));
                }

                return sharp(svgPath)
                    .resize(scaledWidth, scaledHeight)
                    .png()
                    .toFile(outputPath, (err, info) => {
                        if (err) {
                            console.error(chalk.red(`Error converting file ${svgPath} to PNG:`), err);
                            reject(err);
                        } else {
                            console.log(`${chalk.green.bold("SVG Converted".padStart(15))} ${outputPath}`);
                            resolve();
                        }
                    });
                })
                .catch((err) => {
                    console.error(chalk.red("Error reading SVG metadata:"), err);
                    reject(err);
                });


        sharp(svgPath)
            .png()
            .toFile(outputPath, (err, info) => {
                if (err) {
                    console.error(chalk.red(`Error converting file ${svgPath} to PNG:`), err);
                    reject(err);
                } else {
                    console.log(`${chalk.green.bold("SVG Converted".padStart(15))} ${outputPath}`);
                    resolve();
                }
            });
    });
}