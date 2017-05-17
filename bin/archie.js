#!/usr/bin/env node


var cli = require('commander');
var pkg = require('../package.json');


/** archie --version */
cli
	.version(pkg.version)
	.description(pkg.description);


/** archie install */
cli
	.command('install <src> [dest]')
	.alias('i')
	.description('install given files to a destination')
	.option('-d, --data <data>', 'Path or object for archie data')
	.option('-u, --update', 'Update .json files with data from data._json[{filepath}] (useful for keeping a moving package.json, for example, in tact)')
	.action(function (src, dest, cli) {
		var archie = require('../');
		var options = {
			data: cli.data,
			merge: cli.merge
		};

		return archie.install(src, dest, options).then(function () {
			console.log('DONE. ツ'); // eslint-disable-line
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
