#!/usr/bin/env node


var cli = require('commander');
var pkg = require('../package.json');


cli
	.version(pkg.version)
	.description(pkg.description);


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
			console.log('DONE. ツ');
		});
	});


cli.parse(process.argv);
