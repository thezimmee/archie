#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * test/fixtures/test-script.js
 * ----------------------------
 * To help test a custom script with multiple commands and output.
 */

var spawn = require('child_process').spawn;

console.log('Starting custom script...');

spawn('ls', ['-aCFG'], {stdio: 'inherit'});

var exec = require('execa');
var Promise = require('es6-promise').Promise;

new Promise(function (reject, resolve) {
	console.log('\nNow running asynchrounously...');
	var command = exec('ls', ['-aCFG'], {stdio: 'inherit'});
	return command.then(function (result) {
		console.log('\nDONE!\n');
		resolve(result);
	}).catch(function (error) {
		console.log('ERROR:', error);
		reject(error);
	});
});
