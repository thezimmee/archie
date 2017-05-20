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


describe('archie the installer', function () {

	after(function () {
		fs.removeSync('test-file.md');
	});

	describe('#install()', function () {
		afterEach(function () {
			// Clean up.
			fs.removeSync('.temp');
			fs.removeSync('.test');
		});

		// Fail if archie.data.js doesn't exist
		it('should throw an error, since no archie.data.js is found', function () {
			var archieDataFilepath = 'archie.data.js';
			var archieTempDataFilepath = 'archie-testing.data.js';

			// Temporarily move archie data file.
			fs.moveSync(archieDataFilepath, archieTempDataFilepath);

			// Run test.
			expect(archie.install).to.throw();

			// Move archie.data.js back.
			fs.moveSync(archieTempDataFilepath, archieDataFilepath);
		});

		// Fail if src path doesn't exist.
		it('should throw an error, since no files should be found', function () {
			// Finding no source files should throw an error.
			expect(archie.install.bind(archie, {src: ['examples/no-exist']})).to.throw();
		});

		// Set up a bunch of tests.
		var tests = [{
			// `archie install`.
			options: {},
			expectedFiles: ['.temp/package.json', '.temp/.eslintrc.js', '.temp/nested/test-file.md'],
			expectedContentFile: function (filepath) {
				return filepath.replace('.temp/', 'test/fixtures/simple/');
			}
		}, {
			// `archie install --data <path>`
			options: {
				data: 'archie.data.js',
			},
			expectedFiles: ['.temp/package.json', '.temp/.eslintrc.js', '.temp/nested/test-file.md'],
			expectedContentFile: function (filepath) {
				return filepath.replace('.temp/', 'test/fixtures/simple/');
			}
		}, {
			// `archie install <src> --data <path>`
			options: {
				src: ['examples/simple/**/*'],
				data: 'archie.data.js',
			},
			expectedFiles: ['.temp/package.json', '.temp/.eslintrc.js', '.temp/nested/test-file.md'],
			expectedContentFile: function (filepath) {
				return filepath.replace('.temp/', 'test/fixtures/simple/');
			}
		}, {
			// Single file with custom archie data path.
			options: {
				src: ['examples/simple/nested/test-file.md'],
				data: 'test/fixtures/archie.data.js',
				dest: '.test',
				base: 'examples/simple'
			},
			expectedFiles: ['.test/nested/test-file.md'],
			expectedContentFile: function (filepath) {
				return filepath.replace('.test/', 'test/fixtures/simple/');
			}
		}, {
			// Ignore files in nested.
			options: {
				src: ['examples/simple'],
				data: 'test/fixtures/archie.data.js',
				// profile: '_alt',
				dest: '.test',
				base: 'examples/simple',
				ignore: ['**/nested/*']
			},
			expectedFiles: ['.test/.eslintrc.js', '.test/package.json'],
			expectedContentFile: function (filepath) {
				return filepath.replace('.test/', 'test/fixtures/simple/');
			}
		// }, {
		// 	// Ignore files in nested.
		// 	options: {
		// 		src: ['examples/simple'],
		// 		data: 'test/fixtures/archie.data.js',
		// 		// profile: '_alt',
		// 		dest: '.test',
		// 		base: 'examples/simple',
		// 		ignore: ['**/*.md', '**/*.json']
		// 	},
		// 	expectedFiles: ['.test/.eslintrc.js'],
		// 	expectedContentFile: function (filepath) {
		// 		return filepath.replace('.test/', 'test/fixtures/simple/');
		// 	}
		}];

		// Run each test.
		tests.forEach(function (test) {
			// Convert options to string.
			var optionsString = function () {
				var string = '[ ';
				Object.keys(test.options).forEach(function (option, i) {
					if (i > 0) {
						string += ' | ';
					}
					if (option === 'src') {
						string += option + ': ' + test.options[option].join(', ');
					} else {
						string += option + ': ' + test.options[option].toString();
					}
				});
				string += ' ]';
				if (string === '[  ]') {
					string = 'no options';
				}
				return string;
			};
			// Run it.
			it('should install with: ' + optionsString(), function (done) {
				// Run compiler.
				archie.install(test.options).then(function (files) {
					// Expect files to be array of file objects.
					expect(files).to.be.instanceof(Array);
					// Expect actualFilepaths to be same as file.filepath.
					var actualFilepaths = [];
					files.forEach(function (file) {
						actualFilepaths.push(file.filepath);
					});
					expect(actualFilepaths).to.have.same.members(test.expectedFiles);
					return files;
				}).then(function (files) {
					// Expect each file to be same as file in .temp/
					files.forEach(function (file) {
						var expectedFileContent = (test.expectedContentFile) ? test.expectedContentFile(file.filepath) : test.expectedContentFiles[test.expectedFiles.indexOf(file.filepath)];
						var expectedContent = fs.readFileSync(expectedFileContent, 'utf8');
						expect(file.content).to.equal(expectedContent);
					});
				}).then(done).catch(done);
			});
		});

		// Do a JSON merge.
		it('should merge data to package.json', function (done) {
			// Setup.
			var originalFilepath = 'test/fixtures/package--before.json';
			var srcFilepath = path.join('.temp', 'package.json');
			var expectedOutputFilepath = 'test/fixtures/package--after.json';

			// Copy package--before.json to .temp.
			fs.copy(originalFilepath, srcFilepath)
				.then(function () {
					// Run archie install '_mergeJson' profile to set the --merge-json option.
					return archie.install({src: [srcFilepath], dest: '.temp', profile: '_jsonProfile'});
				}).then(function (files) {
					// Expect files to only have one file.
					expect(files).to.have.lengthOf(1);
					// Expect package.json to update with new data while leaving existing properties.
					var expectedContent = JSON.stringify(fs.readJsonSync(expectedOutputFilepath), null, '\t');
					expect(expectedContent).to.deep.equal(files[0].content);
					done();
				}).catch(function (error) {
					done(error);
				});
		});
	});
});
