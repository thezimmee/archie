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
	.action(function (src, dest, cli) {
		var archie = require('../');

		return archie.install(src, dest, cli.data).then(function () {
			console.log('DONE. ツ');
		});
	});


cli.parse(process.argv);
