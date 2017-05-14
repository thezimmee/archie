/**
 * archie/index.js
 * ---------------
 * Main controller for Archie the architect.
 */


// Global archie object.
var archie = module.exports = {
	install: installBlock
};


/**
 * @brief Compile files with EJS.
 *
 * @param src {string} File, directory, or glob source files.
 * @param dest {string} Destination directory.
 * @param data {string|object} Path to data file or actual data object.
 * @return {array} Array of file objects (see compileFile function).
 */
function installBlock(src, dest, data = 'archie.data.js') {
	var path = require('path');
	var fs = require('fs-extra');
	var glob = require('globby');
	var Promise = require('es6-promise').Promise;
	var promises = [];
	var stats;

	// Grab archie data.
	if (typeof data !== 'object') {
		data = getData(data);
	}

	// Get true src path and base directory.
	data._basePath = data._basePath || '';
	if (glob.hasMagic(src)) {
		data._basePath = require('glob-parent')(src);
	}
	try {
		stats = fs.statSync(src);
		if (stats.isDirectory()) {
			data._basePath = src;
			src = path.join(src, '**/*');
		} else if (stats.isFile()) {
			data._basePath = path.dirname(src);
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
		promises.push(compileFile(src, dest, data));
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
 * @param dest {string} Destination directory.
 * @param data {object} archie data object.
 * @return {object} {filepath: '{destination path}', content: '{file contents}'}
 */
function compileFile(src, dest = process.cwd(), data = {}) {
	var path = require('path');
	var fs = require('fs-extra');
	var ejs = require('ejs');

	if (!src) {
		throw new Error('Archie needs to know where your {source} files are.')
	}

	// Compile file.
	return ejs.renderFile(src, data, data._ejs || {}, function (error, content) {
		if (error) {
			throw error;
		}
		var file = {
			filepath: path.relative(process.cwd(), path.resolve(dest, path.relative(data._basePath, path.dirname(src)), path.basename(src))),
			content: content
		};

		// Save file.
		return fs.outputFile(file.filepath, file.content).then(function (error) {
			if (error) {
				throw error;
			}
			return file;
		});
	});
}
