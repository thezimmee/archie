/**
 * test/runner.js
 * --------------
 * Unit tests for archie command.
 */


// Dependencies.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var archie = require('../index.js');


describe('archie the runner', function () {
	it('should run the custom npm script named `script`', function (done) {
		// Run it.
		archie.run('script').then(function (child) {
			expect(child.code).to.equal(0);
			expect(child.timedOut).to.be.false;
			expect(child.stderr).to.equal(null);
			expect(child.cmd).to.contain('npm run script');
			done();
		}).catch(done);
	});

	it('should pass arguments to the `echo` npm script', function (done) {
		// Run it.
		var exec = require('execa');
		exec('archie', ['echo', 'Hello world!!!', '-s']).then(function (child) {
			expect(child.stdout).to.equal('Hello world!!!');
			done();
		}).catch(done);
	});

	it('should fail since command doesn\'t exist.', function () {
		// Run it.
		expect(archie.run.bind(archie, 'no-exist')).to.throw();
	});

	it('should fail since `package.json` doesn\'t exist.', function () {
		var fs = require('fs-extra');
		var originalPackageJson = 'package.json';
		var renamedPackageJson = 'package--renamed.json';

		// Temporarily move archie data file.
		fs.moveSync(originalPackageJson, renamedPackageJson);

		// Run it.
		expect(archie.run.bind(archie, 'no-exist')).to.throw();

		// Move archie.data.js back.
		fs.moveSync(renamedPackageJson, originalPackageJson);
	});
});
