# Flint

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)


Flint CLI is a simple and efficient tool for managing and converting SVG files in your projects. With Flint, you can quickly convert SVG files to PNGs and watch for changes in your asset folder to automate conversions.

## Features

- **SVG to PNG Conversion**: Convert all SVG files in a folder to PNG format with a single command.
- **Watch Mode**: Automatically convert SVGs to PNGs whenever changes are detected.
- Customizable input and output paths.

## Installation

You can install Flint globally using npm:

```bash
npm i -g @achyuta-studios/flint
```

Or, use it locally in your project:

```bash
npm i @achyuta-studios/flint --save-dev
```

## Usage

Flint provides two main commands: `svg-to-png` and `watch-svg`.

### `svg-to-png`

Convert all SVG files in the input folder to PNG format.

#### Syntax

```bash
flint svg-to-png [options]
```

#### Options

| Option                | Default     | Description                                |
|-----------------------|-------------|--------------------------------------------|
| `-i, --input [path]`  | `assets_src`  | Path to the folder containing SVG files.   |
| `-o, --output [path]` | `assets`    | Path to save the converted PNG files.      |
| `-s, --scale [factor]`| `1`         | Scaling factor for the output PNG.         |

#### Example

```bash
flint svg-to-png
flint svg-to-png --input svgFolder --output pngFolder
```

### `watch-svg`

Watch for changes in SVG files and automatically convert them to PNG.

#### Syntax

```bash
flint watch-svg [options]
```

#### Options

| Option                   | Default      | Description                   |
|--------------------------|-------------|--------------------------------|
| `-i, --input [path]`      | `assets_src`  | Path to the folder containing SVG files.|
| `-o, --output [path]`     | `assets`    | Path to save the converted PNG files.|
| `-s, --scale [factor]`| `1`         | Scaling factor for the output PNG.         |
| `--ignoreInitial [bool]`  | `true`      | Ignore initial file detection when starting the watcher.|


#### Example

```bash
flint watch-svg
flint watch-svg --input svgFolder --output pngFolder --ignoreInitial false
```
