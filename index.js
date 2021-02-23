const inquirer = require('inquirer');
const superagent = require('superagent');
const fs = require('fs');
const { spawnSync } = require('child_process');
const _ = require('underscore');

const EXPORT_DIR = './exported/';

let getCommitHistory = async (username, year) => {
	console.log('');

	let cacheFilename = `response-${username}-${year}.json`;
	let contribData = {};

	if (fs.existsSync(`${EXPORT_DIR}${cacheFilename}`)) {
		console.log(`***** Using cached data from ${EXPORT_DIR}${cacheFilename} *****`);
		contribData = require(`${EXPORT_DIR}${cacheFilename}`);
	} else {
		console.log(`***** Getting data from skyline.github.com *****`);

		try {
			let response = await superagent.get(`https://skyline.github.com/${username}/${year}.json`);
			contribData = response.body;

			// cache file
			fs.writeFileSync(`${EXPORT_DIR}${cacheFilename}`, JSON.stringify(contribData, null, 2));
		} catch (err) {
			console.log(err);
			process.exit();
		}
	}

	return contribData;
}

let scaleContribValue = (t, e, n, r) => {
	// t = contribCount
	// e = min contrib count
	// n = max contrib count
	// r = contrib.p99

	// erm, "borrowed" from the website. Could have rewritte, but why bother?
	var o = (0).toFixed(4);
	t === e ? o = .1.toFixed(4) : t > e && t <= r ? o = (.1 + .8 / r * t).toFixed(4) : t > r && (o = (.9 + .1 / n * t).toFixed(4));

	return o;
}

let scaleAndPackContribData = (commitData) => {
	// Scaled week data is an array of arrays. Each array has three values:
	//	[ scaledContribValue, weekNumber, dayNumber ]
	// weekNumber and dayNumber are 0-based indexes
	let scaledWeekData = [];

	for (const contribWeek of commitData.contributions) {
		let lenAdd = 0;

		if (contribWeek.week === 0) {
			// The first week of 2020 only has 4 days listed -
			// this is probably the only week we want to shift like this
			lenAdd = 7 - contribWeek.days.length;
		}

		// Now loop through our day data for this week
		let dayNumber = 0;

		for (const contribDay of contribWeek.days) {
			if (contribDay.count > 0) {
				// Only append a value if it's something we can draw a bar for
				scaledWeekData.push([scaleContribValue(contribDay.count, commitData.min, commitData.max, commitData.p99), contribWeek.week, dayNumber + lenAdd]);
			}

			dayNumber++;
		}
	}

	return scaledWeekData;
}

let generateOpenSCAD = (commitData, scaledWeekData, overrideFile) => {
	let openScadFile = fs.readFileSync('./src/skyline.scad').toString();
	let overrides = require(`./overrides/${overrideFile}.js`);

	let openScadCommands = '';

	for (week of scaledWeekData) {
		openScadCommands += `drawBar(${week[0]}, ${week[1]}, ${week[2]});`;
	}

	let compiled = _.template(openScadFile);

	compiledString = compiled({
		...overrides.overrides,
		username: commitData.username,
		year: commitData.year,
		drawBarCalls: openScadCommands
	});

	let scadFilename = `skyline_${commitData.username}_${commitData.year}-${overrideFile}.scad`;

	fs.writeFileSync(`${EXPORT_DIR}${scadFilename}`, compiledString);

	console.log(`>>>>> Wrote OpenSCAD file to ${EXPORT_DIR}${scadFilename} >>>>>`);

	return scadFilename;
}

let generateStl = (openSCADfile, fileSuffix) => {
	console.log(`~~~~~ Generating STL using ${EXPORT_DIR}${openSCADfile} ~~~~~`);
	console.log(`((((( this might take some time )))))`);

	// openscad -o ./exported/skyline_.stl exported/skyline_ururk_2020.scad
	spawnSync('openscad', ['-o', `${EXPORT_DIR}${openSCADfile.replace('.scad', '')}.stl`, `${EXPORT_DIR}${openSCADfile}`]);
}

let main = async () => {
	// Make export directory - this creates it if it is missing
	fs.mkdirSync(EXPORT_DIR, { recursive: true });

	// List the directory contents
	let files = fs.readdirSync(EXPORT_DIR);
	let cacheFiles = [];
	let overrideFiles = [
		'standard',
		'fully_hollow_base',
		'hollow_base_with_escape_hole'
	];
	let suggestedUsername = '';
	let defaultOverride = 0;
	let suggestedYear = (new Date()).getFullYear() - 1;

	for (const file of files) {
		let fileParts = file.replace('.json').split('-');

		if (fileParts.length === 3) {
			suggestedUsername = fileParts[1];
			suggestedYear = fileParts[2];
		}
	}

	files = fs.readdirSync('./overrides/');

	for (const fileIndex in files) {
		if (files[fileIndex].indexOf('.js') > 0) {
			let fileShortName = files[fileIndex].replace('.js', '');

			if (!overrideFiles.includes(fileShortName)) {
				overrideFiles.push(fileShortName);
			}
		}
	}

	inquirerPrompts = [
		{
			name: 'username',
			type: 'input',
			message: 'Enter a GitHub username:',
			default: () => {
				return suggestedUsername;
			},
			validate: (input) => {
				if (input.trim().length < 1) {
					return 'Please enter a username';
				} else {
					return true;
				}
			}
		},
		{
			name: 'year',
			type: 'number',
			message: 'Enter a year (YYYY):',
			default: () => {
				return parseInt(suggestedYear, 10);
			},
			validate: (input) => {
				if (input.toString().length !== 4) {
					return 'Please enter a valid 4-digit year';
				} else {
					return true;
				}
			},
			filter: (input) => {
				if (input.toString().length !== 4) {
					return '';
				}

				return parseInt(input, 10) || '';
			}
		}
	];

	if (overrideFiles.length > 0) {
		inquirerPrompts.push({
			name: 'overrideFile',
			type: 'list',
			message: 'Pick an override file:',
			default: defaultOverride,
			choices: overrideFiles
		});
	}

	inquirer.prompt(inquirerPrompts)
	.then(async (answers) => {
		let commitData = await getCommitHistory(answers.username, answers.year);

		let scaledWeekData = scaleAndPackContribData(commitData);

		let openScadFile = generateOpenSCAD(commitData, scaledWeekData, answers.overrideFile);

		generateStl(openScadFile, answers.overrideFile);
	})
	.catch(error => {
		if(error.isTtyError) {
			// Prompt couldn't be rendered in the current environment
		} else {
			// Something else went wrong
		}
	});
}

main();