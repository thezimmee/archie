/**
 * archie.block.js
 * ---------------
 * Provides dynamic data for a building block, and tells archie how it should be installed.
 *
 * question object syntax:
 * @type {string} (input|confirm|list|rawlist|password)
 * @name {string|function()} name in answers hash
 * @message {string|function} message / question to print
 * @default {string|number|array|function} default value
 * @choices {array|function} list of options (array can be object with name and value)
 * @validate {function(input, answers)} return true if value is valid or error message string otherwise
 * @filter {function(input)} receive user input and return filtered value to be used inside program. value returned is added to the answers hash.
 * @when {function(answers)|boolean} receive current user answers hash and return true or false if it should be asked.
 */

var block = module.exports = {};

/**
 * Array of questions Archie will ask if he doesn't already know the answers from archie.config.js.
 */
block.questions = [{
		type: 'list',
		name: 'project.repo.location',
		message: 'Where is the project repo?',
		default: 'github',
		choices: ['github', 'bitbucket']
	}, {
		type: 'input',
		name: 'project.name',
		message: function (answers) {
			return 'What is the name of the ' + answers.project.repo.location + ' project?';
		},
		filter: function (input) {
			return input.toLowerCase();
		}
	}, {
		type: 'input',
		name: 'project.repo.username',
		when: function (answers) {
			// If `when` property does not exist, Archie will not ask a question if the answer already exists in `archie.config.js` from the installation's root folder. This example is strictly to show that `block.config` can be used in `archie.block.js` to view any existing configuration from `archie.config.js`.
			return !block.config.project || !block.config.project.repo || !block.config.project.repo.username;
		},
		message: function (answers) {
			return 'What is user name for the ' + answers.project.repo.location + ' repo?';
		},
		filter: function (input) {
			return input.toLowerCase();
		}
	}, {
		type: 'list',
		name: 'project.repo.protocol',
		message: function (answers) {
			return 'How do you want to access the ' + answers.project.repo.location + ' repo?'
		},
		default: 'ssh',
		choices: ['ssh', 'https']
	}, {
		type: 'confirm',
		when: function (answers) {
			if (answers.project.repo.protocol && answers.project.repo.location && answers.project.repo.username && answers.project.name) {
				answers.project.repo.url = [
					(answers.project.repo.protocol === 'https') ? 'https://' : 'git@',
					(answers.project.repo.location === 'bitbucket' && answers.project.repo.protocol === 'https') ? answers.project.repo.username + '@' : '',
					answers.project.repo.location,
					(answers.project.repo.location === 'bitbucket') ? '.org' : '.com',
					(answers.project.repo.protocol === 'https') ? '/' : ':',
					answers.project.repo.username, '/' +
					answers.project.name + '.git'
				].join('');

				answers.project.repo.bugs = 'https://' + answers.project.repo.location + '.com/' + answers.project.repo.username + '/' + answers.project.name + '/issues';
			}
			return false;
		}
	}, {
		type: 'input',
		name: 'project.repo.url',
		default: function (answers) {
			return !answers.project.repo.url;
		},
		when: function (answers) {
			return !answers.project.repo.url;
		},
		message: function (answers) {
			return 'What is the ' + answers.project.repo.protocol + ' URL for the ' + answers.project.repo.location + ' repo?';
		}
	}, {
		type: 'input',
		name: 'project.repo.bugs',
		message: 'What is the URL for bug submissions?',
		when: function (answers) {
			return !answers.project.repo.bugs;
		},
		default: function (answers) {
			return answers.project.repo.bugs;
		}
	}, {
		type: 'input',
		name: 'project.author.name',
		message: 'What is the author\'s name?',
		default: function (answers) {
			return answers.project.repo.username;
		}
	}, {
		type: 'input',
		name: 'project.author.email',
		message: 'What is the author\'s email?'
	}, {
		type: 'input',
		name: 'project.author.url',
		message: 'What is the author\'s website url?',
		default: function (answers) {
			return answers.project.repo.url;
		}
	}, {
		type: 'input',
		name: 'project.description',
		message: 'What is the description of this project?'
	}, {
		type: 'input',
		name: 'project.version',
		message: 'What is the current version of this project?',
		default: '0.0.1',
	}, {
		type: 'list',
		name: 'project.license',
		message: 'What is the project\'s license (see https://choosealicense.com/)?',
		default: 'MIT',
		choices: ['MIT', 'Apache License 2.0', 'GNU GPLv3', 'UNLICENSED']
	}, {
		type: 'input',
		name: 'project.keywords',
		filter: function (input) {
			// Convert input to an array if it's not already.
			if (!Array.isArray(input)) {
				input = input.split(/[\s,]+/);
			}
			return input;
		},
		message: 'What are related keywords for this project (comma-separated list)?'
	}, {
		type: 'confirm',
		name: 'project.private',
		message: 'Should this project be private?',
		default: false
	}, {
		type: 'input',
		name: 'dirs.src',
		default: 'src',
		message: function (answers) {
			return 'What is the project\'s source directory, relative to ' + process.cwd() + '?';
		}
	}, {
		type: 'input',
		name: 'dirs.dest',
		default: 'build',
		message: function (answers) {
			return 'What is the project\'s build directory, relative to ' + process.cwd() + '?';
		}
	}, {
		type: 'input',
		name: 'globs.pages',
		default: '**/*.html.pug',
		filter: function (input, answers) {
			answers = answers || block.config;
			input = input.split(',');
			input.forEach(function (glob) {
				glob = answers.dirs.src + '/' + glob;
			});
			return input;
		},
		message: function (answers) {
			return 'Enter the pug glob to compile HTML pages, relative to ' + require('path').join(process.cwd(), answers.dirs.src) + '?';
		}
	}];


/**
 * Hooks allow you to run functions at certain phases of archie's workflow.
 */
var section = 1;
block.hooks = {
	preInstall: function (config) {
		// Add pug options.
		config.pug = {
			options: {
				data: config.globs ? config.globs.data || {} : {},
			}
		};
	},
	eachQuestion: function (question, answers) {
		if (section === 1 && stringContains(question.name, ['project.repo', 'project.name'])) {
			section = 2;
			console.log('');
			console.log('-----------------------------');
			console.log('[i] Enter repository details.');
			console.log('-----------------------------');
		} else if (section === 2 && stringContains(question.name, ['project.description', 'project.version', 'project.author', 'project.license', 'project.keywords', 'project.private'])) {
			section = 3;
			console.log('');
			console.log('-----------------------------------');
			console.log('[i] Enter details for package.json.');
			console.log('-----------------------------------');
		} else if (section === 3 && stringContains(question.name, ['dirs.', 'globs.'])) {
			section = 4;
			console.log('');
			console.log('--------------------------------------');
			console.log('[i] Enter globs / paths for the build.');
			console.log('--------------------------------------');
		}
	},
	eachAnswer: function (question, answers) {},
	compileFile: function (filepath, content) {
		console.log('Compiling [%s]', filepath);
		return content;
	},
	postCompileFile: function (filepath, content) {
		var path = require('path');
		console.log('Finished compiling [%s]', filepath);
		if (path.extname(filepath) === '.pug') {
			return '// My banner goes here.\n' + content;
		}
		return content;
	},
	saveFile: function (file) {
		console.log('Saved [%s] to [%s].', file.src, file.path);
	},
	postInstall: function (shell, files) {
		shell.echo('');
		shell.echo('postInstall hook complete.');
	}
};

function stringContains (string, stringsArray, pos = 0) {
	var contains = false;
	if (!string) {
		return false;
	}
	stringsArray.forEach(function (item, i) {
		if (string.indexOf(item) === pos) {
			contains = true;
		}
	});
	return contains;
}
