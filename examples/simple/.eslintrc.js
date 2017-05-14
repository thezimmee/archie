/**
 * .eslintrc.js
 * ------------
 * Configuration for ESLint.
 */

module.exports = {
	extends: 'eslint:recommended',
	env: {
		<%_ parseObject(eslint.env, '\t\t') -%>
	},
	globals: {
		<%_ parseObject(eslint.globals, '\t\t') -%>
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
<%_ function parseObject(obj, prefix) {
	var keys = Object.keys(obj);
	keys.forEach(function (key) { -%><%_
		-%><%= prefix + key + ': ' + obj[key] + ',\n'
	%><%_ });
} -%>
