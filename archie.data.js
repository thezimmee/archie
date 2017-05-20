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
	author: 'The Zimmee <thezimmee@gmail.com>',
	homepage: 'https://github.com/thezimmee/archie'
};

data.eslint = {
	env: {
		es6: true,
		node: true,
		mocha: true
	},
	extends: 'eslint:recommended',
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always']
	}
};

data.coveralls = {
	token: 'seb5QhZdIWCeVHikVOzLqsxeluneC8pGi'
};

data.sublime = {
	folderExcludePatterns: [
		'node_modules'
	]
};

data.json = {
	'package.json': {
		name: data.project.name.toLowerCase(),
		description: data.project.description,
		author: data.project.author,
		version: data.project.version,
		repository: {
			type: 'git',
			url: data.project.homepage,
		},
		license: 'MIT',
		bugs: 'https://github.com/thezimmee/archie/issues',
		homepage: data.project.homepage,
		keywords: ['static', 'site', 'generator', 'front', 'end', 'css', 'framework'],
		private: true,
		main: 'index.js',
		bin: {
			'archie': './bin/archie.js'
		},
		directories: {
			test: 'test'
		},
		scripts: {
			test: 'npm run test:lint -s && npm run test:unit -s',
			'test:lint': './node_modules/.bin/eslint ./*.js ./bin/*.js ./bin/**/*.js ./test/*.js ./test/**/*.js && echo \'=> All JS files linted!\'',
			'test:unit': 'nyc ./node_modules/.bin/mocha',
			coveralls: 'npm test && nyc report --reporter=text-lcov | coveralls && echo \'=> DONE! Test coverage submitted to https://coveralls.io.\'',
			codacy: 'npm test && nyc report --reporter=text-lcov | ./node_modules/.bin/codacy-coverage && echo \'=> DONE! Test coverage submitted to https://codacy.com.\'',
			codecov: 'npm test && nyc report --reporter=lcov > coverage.lcov && ./node_modules/.bin/codecov --token=3b10ee78-0f52-466f-8d15-22d2c5e67017 && echo \'=> DONE! Test coverage submitted to https://codecov.io.\'',
			precommit: 'npm test -s',
			echo: 'echo',
			script: 'node test/fixtures/test-script.js'
		}
	}
};

//
// The '_installer' object is the default configuration profile. You can create multiple profiles and use any of them with the `--profile` cli option. This allows you to have multiple configurations in a single archie data file.
data._installer = {
	src: ['examples/simple'],
	dest: '.temp'
};

//
// This profile shows how to merge json files programatically.
data._jsonProfile = {
	src: ['examples/simple'],
	dest: '.temp',
	json: {
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
	}
};

//
// The '_archie' profile is for compiling examples/archie.
data._archie = {
	src: ['examples/archie/**/*'],
	dest: '.',
	base: 'examples/archie',
	ignore: ['**/partials/**/*']
};
