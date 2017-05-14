/**
 * .eslintrc.js
 * ------------
 * Configuration for ESLint.
 */

module.exports = {
	extends: 'eslint:recommended',
	env: {
		node: true,
	},
	globals: {
		angular: true,
		$: true,
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
