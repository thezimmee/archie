/**
 * .eslintrc.js
 * ------------
 * Configuration for ESLint.
 */

module.exports = {
	extends: 'eslint:recommended',
	env: {
		browser: true,
	},
	globals: {
		angular: false,
		$: false,
	},
	rules: {
		// enable additional rules
		indent: ['error', 4],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		// override default rules
		// disable rules
	}
};
