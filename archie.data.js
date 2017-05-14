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
	version: '0.0.1',
	author: {
		name: 'Zimmee',
		email: 'thezimmee@gmail.com',
		url: 'https://tysonzimmerman.com'
	},
	homepage: 'https://github.com/thezimmee/archie'
};

data.pkg = {
	name: data.project.name.toLowerCase(),
	description: data.project.description,
	version: data.project.version,
	author: data.project.author,
	repo: {
		type: 'git',
		url: data.project.homepage,
	},
	bugs: 'https://github.com/thezimmee/archie/issues',
	license: 'MIT',
	homepage: data.project.homepage,
	keywords: 'static, site, generator, front, end, css, framework',
	private: true
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
