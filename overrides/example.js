// Example file showing how to import and override settings from a base file
// Alternatively you can copy one of the existing override files and rename it
// This file is EXCLUDED from your options

let overrides = require('./standard.js');

overrides.fontFamily = 'Helvetica Neue:style=Bold';

module.exports = overrides;