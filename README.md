# skyline-clone
Clone of GitHub's "Skyline" 3D model generator - but this one uses OpenSCAD

This (tiny) project was created to get past some shortcomings of the [GitHub-generated skyline](https://skyline.github.com) stl:

  1. Minize errors in file geometry
  2. Create printable file in most slicers without need for repair
  3. Allow end-users to customize the output

## Requirements

  1. Install [OpenSCAD](https://openscad.org)
    * OpenSCAD set up as `openscad` in your shell [Command Line Instructions](https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Using_OpenSCAD_in_a_command_line_environment)
  3. Install Node.js (tested with 14, but should work with older and newer versions)

## Setup

  1. If you want to change some of the defaults, duplicate `overrides/defaults.js` and rename it. Modify the settings and choose it when you run the script.

## Running

```shell
# install dependencies
npm i

# run
npm run
```
