/**
 * test/utils.js
 * -----------
 * Unit tests for archie utilities.
 */


// Dependencies.
var utils = require('../lib/utils');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;


describe('archie utils', function () {
	it('should convert comma-separated list to an array.', function () {
		var input = 'one.js,two.js,three.js';
		var actual = utils.list(input);
		var expected = [ 'one.js', 'two.js', 'three.js' ];

		expect(actual).to.be.instanceof(Array);
		expect(actual).to.have.lengthOf(3);
		expect(actual).to.have.same.members(expected);
	});
});
