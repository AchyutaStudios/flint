import { glob } from "glob";
import path from 'path';
import sharp from "sharp";
import fs from 'fs';
import chalk from "chalk";

export async function svg2png(inputDir: string, outputDir: string) {
    const svgFiles = await glob(`${inputDir}/**/*.svg`);
    console.log(chalk.green(`Found ${svgFiles.length} SVG file(s) for conversion.`));

    svgFiles.forEach(async (item) => {
        const outputPath = `${outputDir}\\${path.relative(inputDir, item)}`;
        const doubleSlashPath = outputPath.replace(/\\/g, '\\\\');

        if (!fs.existsSync(path.dirname(doubleSlashPath))) {
            await fs.promises.mkdir(path.dirname(doubleSlashPath), { recursive: true });
        }

        sharp(item)
            .png()
            .toFile(outputPath.replace('.svg', '.png'), (err, info) => {
                if (err) {
                    console.error(chalk.red(`Error converting file ${item} to PNG:`), err);
                } else {
                    process.stdout.write(`Successfully converted ${item} to png\r`);
                }
              });

    });
    console.log(chalk.green('Completed SVG Conversion.'));
}