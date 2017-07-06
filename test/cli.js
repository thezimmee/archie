/**
 * test/cli.js
 * -----------
 * Unit tests for archie cli.
 */


// Dependencies.
var fs = require('fs-extra');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
// Local vars.
var tempDir = '.temp';


describe('archie cli', function () {
	describe('install [options]', function () {
		afterEach(function () {
			// Clean up.
			fs.removeSync(tempDir);
		});

		it('should run archie install cli successfully', function (done) {
			// Setup.
			var spawn = require('child_process').spawn;
			var expectedFilepaths = ['.temp/package.json', '.temp/.eslintrc.js', '.temp/nested/test-file.md'];
			var expectedContentFiles = ['test/fixtures/simple/package.json', 'test/fixtures/simple/.eslintrc.js', 'test/fixtures/simple/nested/test-file.md'];

			// Run command.
			var install = spawn('archie', ['i', 'examples/simple', '--data', 'test/fixtures/archie.js'], {stdio: 'inherit'});
			install.on('close', function () {
				// Expect each file to be same as file in .temp/
				expectedFilepaths.forEach(function (filepath, n) {
					var expectedContent = fs.readFileSync(expectedContentFiles[n], 'utf8');
					var actualContent = fs.readFileSync(filepath, 'utf8');
					expect(actualContent).to.equal(expectedContent);
				});
				install.kill();
				done();
			});
		});
	});
});
