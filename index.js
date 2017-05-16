/**
 * archie/index.js
 * ---------------
 * Main controller for Archie the architect.
 */


// Global archie object.
var archie = module.exports = {
	install: installBlock,
	run: runTask
};


/**
 * @brief Compile files with EJS.
 *
 * @param src {string} File, directory, or glob source files.
 * @param dest {string} Destination directory.
 * @param options {object} Options object.
 * @return {array} Array of file objects (see compileFile function).
 */
function installBlock(src, dest, options) {
	var path = require('path');
	var fs = require('fs-extra');
	var glob = require('globby');
	var Promise = require('es6-promise').Promise;
	var promises = [];
	var stats;

	// Set options defaults.
	options = Object.assign({data: 'archie.data.js'}, options);

	// Grab archie data.
	if (typeof options.data !== 'object') {
		options.data = getData(options.data);
	}

	// Get true src path and base directory.
	options.basePath = options.basePath || '';
	if (glob.hasMagic(src)) {
		options.basePath = require('glob-parent')(src);
	}
	try {
		stats = fs.statSync(src);
		if (stats.isDirectory()) {
			options.basePath = src;
			src = path.join(src, '**/*');
		} else if (stats.isFile()) {
			options.basePath = path.dirname(src);
		}
	} catch(error) {}

	// Get source file paths.
	var filepaths = getSourceFilepaths(src);
	if (!filepaths.length) {
		throw new Error('No source files were found.');
	}
	// Compile each file.
	filepaths.forEach(function (src) {
		// Do not compile `archie.block.js`
		if (path.basename(src) === 'archie.block.js') {
			return;
		}
		// Compile file.
		promises.push(compileFile(src, dest, options));
	});
	// Return promise which results in array of file objects.
	return Promise.all(promises);
}


/**
 * @brief Gets the archie configuration file.
 *
 * @param dataPath {string} (optional) Filepath to config file.
 * @return {object} Config object.
 */
function getData(dataPath) {
	var path = require('path');
	dataPath = dataPath || './archie.data.js';
	return require(path.resolve(dataPath));
}


/**
 * @brief Gets the source filepaths.
 *
 * @param src {string} src directory or files glob.
 * @return {array} of source filepaths.
 */
function getSourceFilepaths(src) {
	var glob = require('globby');
	return glob.sync(src, {dot: true, nodir: true});
}


/**
 * @brief Compiles a file with archie data.
 *
 * @param src {string} Source file path.
 * @param dest {string} (optional) Destination directory. Defaults to cwd.
 * @param options {object} Options object.
 * @return {object} {filepath: '{destination path}', content: '{file contents}'}
 */
function compileFile(src, dest = process.cwd(), options = {}) {
	var path = require('path');
	var fs = require('fs-extra');
	var ejs = require('ejs');

	if (!src) {
		throw new Error('Archie needs to know where your {source} files are.')
	}

	// Ensure data exists.
	options.data = options.data || {};

	// Compile file.
	return ejs.renderFile(src, options.data, options.data._ejs || {}, function (error, content) {
		if (error) {
			throw error;
		}

		// Create file object.
		var file = {};
			file.source = src;
			file.directory = path.relative(options.basePath, path.dirname(src));
			file.name = path.basename(src);
			file.pathRelative = path.join(path.relative(options.basePath, path.dirname(src)), file.name);
			file.filepath = path.relative(process.cwd(), path.resolve(dest, file.directory, file.name));
			file.content = content;

		// For .json files, if a destination file exists, process it as js object and only update portions that changed.
		if (options.update && options.data._json && path.extname(file.filepath) === '.json' && options.data._json[file.pathRelative] && fs.pathExistsSync(file.filepath)) {
				// Merge data with json file.
				file.content = Object.assign(
					{},
					// Old file content.
					fs.readJsonSync(file.filepath),
					// New file content.
					JSON.parse(file.content),
					// Data from archie data's options.data._json[{filepath}].
					options.data._json[file.pathRelative]
				);
				file.content = JSON.stringify(file.content, null, '\t');
		}

		// Save file.
		return fs.outputFile(file.filepath, file.content)
			.then(function (error) {
				if (error) {
					throw error;
				}
				return file;
			});
	});
}


/**
 * @brief Pass a command to `npm run`.
 *
 * @param command {string} Command to run.
 * @param flags {array} Array of flags / arguments for command.
 * @return {process} Child process instance, enhanced with Promise support (see https://github.com/sindresorhus/execa).
 */
function runTask(command, flags = []) {
	var path = require('path');
	var fs = require('fs-extra');
	var pkg = path.join(process.cwd(), 'package.json');

	// Make sure package.json exists.
	if (fs.pathExistsSync(pkg)) {
		pkg = require(pkg);
	} else {
		throw new Error('Uh oh... Archie could not find `package.json` in your working directory. You\'ll need to create it with your scripts in order to have Archie run ' + command + '.');
	}

	// Make sure script exists in package.json.
	if (!pkg.scripts[command]) {
		throw new Error('Uh oh... Archie could not find the `' + command + '` script in package.json. Typo?');
	}

	// Run it.
	var exec = require('execa');
	command = exec('npm', ['run', command].concat(flags), {stdio: 'inherit'});

	// Run the command.
	return command.catch(function (error) {
		return error;
	});
}
