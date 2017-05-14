/**
 * test/installer.js
 * -----------------
 * Unit tests for archie the installer.
 */


// Dependencies.
var fs = require('fs-extra');
var path = require('path');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
// Local vars.
var archie = require('../index.js');
var tempDir = '.temp';


describe('archie', function () {

	after(function () {
		fs.removeSync('test-file.md');
	});

	describe('#install()', function () {
		afterEach(function () {
			// Clean up.
			fs.removeSync(tempDir);
		});

		// Set up each test.
		var tests = [{
			// archie.install(src = '', dest = '', data = '');
			src: 'examples/simple',
			dest: tempDir,
			data: 'test/fixtures/archie.data.js',
			expectedFiles: ['.temp/package.json', '.temp/.eslintrc.js', '.temp/nested/test-file.md'],
			expectedContentFiles: ['test/fixtures/simple/package.json', 'test/fixtures/simple/.eslintrc.js', 'test/fixtures/simple/nested/test-file.md']
		}, {
			// archie.install(src = '');
			src: 'examples/simple/nested/test-file.md',
			dest: undefined,
			data: undefined,
			expectedFiles: ['test-file.md'],
			expectedContentFiles: ['test/fixtures/simple/nested/test-file.md']
		}, {
			// archie.install(src = '', dest = '', data = {});
			src: 'examples/simple/**/*',
			dest: tempDir,
			data: {
				project: {
					name: 'Archie',
					alias: 'Archie the Amazing'
				},
				pkg: require('../archie.data.js').pkg,
				eslint: {
					env: {
						node: true
					},
					globals: {
						angular: true,
				        $: true
					}
				}
			},
			expectedFiles: ['.temp/package.json', '.temp/.eslintrc.js', '.temp/nested/test-file.md'],
			expectedContentFiles: ['test/fixtures/simple--alt/package.json', 'test/fixtures/simple--alt/.eslintrc.js', 'test/fixtures/simple--alt/nested/test-file.md']
		}];

		// Run each test.
		tests.forEach(function (test, i) {
			it('should compile ' + test.src + ' to ' + (test.dest || '{cwd}'), function (done) {
				// Run compiler.
				archie.install(test.src, test.dest, test.data).then(function (files) {
					// Expect files to be array of file objects.
					expect(files).to.be.instanceof(Array);
					// Expect actualFilepaths to be same as test.expectedFiles[i].
					var actualFilepaths = [];
					files.forEach(function (file) {
						actualFilepaths.push(file.filepath);
					});
					expect(actualFilepaths).to.have.same.members(test.expectedFiles);
					return files;
				}).then(function (files) {
					// Expect each file to be same as file in .temp/
					files.forEach(function (file, n) {
						var fileIndex = test.expectedFiles.indexOf(file.filepath);
						var expectedContent = fs.readFileSync(test.expectedContentFiles[fileIndex], 'utf8');
						expect(fileIndex).to.be.above(-1);
						expect(file.content).to.equal(expectedContent);
					});
				}).then(done).catch(done);
			});
		});

		it('should throw an error, since no files should be found', function () {
			// No {src} argument should throw an error.
			expect(archie.install).to.throw();
			// Finding no source files should throw an error.
			expect(archie.install.bind(archie, 'examples/no-exist')).to.throw();
		});
	});
});
