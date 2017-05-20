#!/usr/bin/env node


var cli = require('commander');
var pkg = require('../package.json');


/** archie --version */
cli
	.version(pkg.version)
	.description(pkg.description);


/** archie install */
cli
	.command('install [src...]')
	.alias('i')
	.description('install given src files to the current directory or a given destination (<src> must be passed or set in the archie data file).')
	.option('-e, --dest <path>', 'Path to destination directory.')
	.option('-d, --data <path>', 'Path to archie data file.')
	.option('-p, --profile <string>', 'Property name to use for options object (defaults to \'_installer\').')
	// Not allowing --merge-json here as it would need to parsed to JSON and is likely not needed via cli.
	// .option('-m, --merge-json <paths>', 'Objects array with .json filepath as keyname and data to merge to existing .json files (useful for managing dynamic .json files, such as package.json)')
	.option('-i, --ignore <paths>', 'Array of filepaths to ignore / not compile to destination (useful for partials).', list)
	.option('-b, --base <path>', 'Base path. Sets all <src> files relative to this path.')
	.action(function (src, cli) {
		var archie = require('../');
		var options = {};
		var keys = ['dest', 'data', 'profile', 'mergeJson', 'ignore', 'base'];

		// Attach each option in cli to options.
		keys.forEach(function (key) {
			if (cli[key]) {
				options[key] = cli[key];
			}
		});

		// Attach src to options.
		options.src = src || [];

		// Run archie the installer.
		return archie.install(options).then(function () {
			console.log('=> DONE. ツ'); // eslint-disable-line
		});
	});


/** archie <cmd> */
cli
	.command('* <cmd>')
	.description('Run an npm task')
	.parse(process.argv)
	.action(function (cmd, cli) {
		var archie = require('../');
		var flags = cli.rawArgs.slice(3);

		return archie.run(cmd, flags);
	});


/** parse args */
cli.parse(process.argv);


/** Convert value to list */
function list(value) {
	return value.split(',');
}
