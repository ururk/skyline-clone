# skyline-clone
Clone of GitHub's "Skyline" 3D model generator - but this one uses OpenSCAD

This (tiny) project was created to get past some shortcomings of the [GitHub-generated skyline](https://skyline.github.com) stl:

  1. Minimize errors in file geometry
  2. Create printable file for most slicers without need for repair
  3. Allow end-users to customize the output
  4. Reduce print cost for powder-based printed parts. Comparing `original.js` with the `hollow_base_with_escape_hole.js` settings, using Shapeways and in Steel, resulted in a savings of $96.39 ($211.29 solid vs $114.90 hollow).

## Requirements

  1. Install [OpenSCAD](https://openscad.org)

      * OpenSCAD set up as `openscad` in your shell - see [Command Line Instructions](https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Using_OpenSCAD_in_a_command_line_environment)

  2. Install [node.js](https://nodejs.org/en/) (tested with 14, but should work with older and newer versions)

## Setup

  1. If you want to change some of the defaults, duplicate one of the files in the `overrides` folder and rename it. Modify the settings and choose it when you run the script.

  2. Install `node.js` dependencies

```shell
# install dependencies
npm i
```

## Running

```shell
# run
npm run start
```

## Customizing

Three default settings files are included - just duplicate the file you'd like to start with and make some changes. When the scripe runs it checks the `overrides` directory for any `.js` files.

Alternatively, export using one of the defaults (or your own) and open the exported `.scad` file and customize in OpenSCAD.