/**
 * archie.data.js
 * --------------
 * Archie data to tell archie how to install various building blocks.
 */


var data = module.exports = {};

data.project = {
	name: 'Archie',
	alias: 'Archie the architect',
	description: 'Archie the architect is a customizable build tool and a task runner.',
	version: '0.0.2',
	author: 'The Zimmee <thezimmee@gmail.com>',
	homepage: 'https://github.com/thezimmee/archie'
};

data._json = {
	'package.json': {
		name: data.project.name.toLowerCase(),
		description: data.project.description,
		version: data.project.version,
		author: data.project.author,
		repository: {
			type: 'git',
			url: data.project.homepage,
		},
		bugs: 'https://github.com/thezimmee/archie/issues',
		license: 'MIT',
		homepage: data.project.homepage,
		keywords: 'static, site, generator, front, end, css, framework',
		private: true,
		scripts: {
			test: 'mocha',
			echo: 'echo I am package.json AFTER.'
		}
	}
};

data.eslint = {
	env: {
		browser: true
	},
	globals: {
		angular: false,
        $: false
	}
};
