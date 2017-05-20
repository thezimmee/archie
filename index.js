/**
 * archie/index.js
 * ---------------
 * Main controller for Archie the architect.
 */


// Global archie object.
var archie = module.exports = { // eslint-disable-line
	install: installBlock,
	run: runTask
};


/**
 * @brief Compile files with EJS.
 *
 * @param options {object} Options object.
 * @return {array} Array of file objects (see compileFile function).
 */
function installBlock(options = {}) {
	var path = require('path');
	var fs = require('fs-extra');
	var Promise = require('es6-promise').Promise;
	var mm = require('micromatch');
	var glob = require('globby');
	var promises = [];
	var defaults = {
		dest: process.cwd(),
		data: 'archie.data.js',
		profile: '_installer',
		merge: ['**/*.json'],
		ignore: [],
		base: undefined
	};
	var data = getData((options && options.data) ? options.data : defaults.data);

	// Apply defaults.
	options = Object.assign({}, defaults, data[options.profile || defaults.profile], options);

	// Get all files in a directory if options.src is a directory.
	options.src.forEach(function (filepath, i) {
		if (glob.hasMagic(filepath)) {
			return;
		}
		var stats = fs.statSync(filepath);
		if (stats && stats.isDirectory()) {
			if (i === 1) {
				options.base = options.base || filepath;
			}
			options.src[i] = path.join(filepath, '**/*');
		} else if (stats && stats.isFile() && i === 1) {
			options.base = options.base || path.dirname(filepath);
		}
	});

	// Expand glob patterns.
	options.src = getSourceFilepaths(options.src);
	options.base = options.base || require('glob-parent')(options.src[0]);

	// Throw error if no source files.
	if (!options.src.length) {
		throw new Error('No source files were found.');
	}

	// Filter out ignored files from options.src.
	if (options.ignore.length) {
		var ignoredFiles = mm(options.src, options.ignore, {dot: true});
		options.src = options.src.filter(function (i) {
			return ignoredFiles.indexOf(i) < 0;
		});
	}

	// Compile each file.
	options.src.forEach(function (filepath) {
		// Compile file.
		promises.push(compileFile(filepath, options, data));
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
 * @param options {object} Options object.
 * @return {object} {filepath: '{destination path}', content: '{file contents}'}
 */
function compileFile(src, options = {}, data = {}) {
	var path = require('path');
	var fs = require('fs-extra');
	var mm = require('micromatch');
	var ejs = require('ejs');

	// Compile file.
	return ejs.renderFile(src, data, data._ejs || {}, function (error, content) {
		if (error) {
			error.message = 'compiling ' + src + ' (' + error.message + ')';
			throw error;
		}

		// Create file object.
		var file = {};
		file.source = src;
		file.directory = path.relative(options.base, path.dirname(src));
		file.name = path.basename(src);
		file.pathRelative = path.join(path.relative(options.base, path.dirname(src)), file.name);
		file.filepath = path.relative(process.cwd(), path.resolve(options.dest, file.directory, file.name));
		file.content = content;

		// Process JSON files that are configured to be merged.
		if (options.merge.length && mm.any(file.source, options.merge, {dot: true})) {
			var newContent = JSON.parse(file.content);
			file.content = Object.assign(
				{},
				// Put new file content here so properties are sorted by new content, not old.
				newContent,
				// Old file content.
				fs.readJsonSync(file.filepath, {throws: false}),
				// New file content goese here again to overwrite old file properties.
				newContent
			);
			file.content = JSON.stringify(file.content, null, '\t');
		}

		// Save file.
		return fs.outputFile(file.filepath, file.content)
			.then(function (error) {
				if (error) {
					error.message = 'saving ' + file.source + ' (' + error.message + ')';
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
	return command;
}
