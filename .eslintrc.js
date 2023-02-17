module.exports = {
	"env": {
		"node": true,
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:@typescript-eslint/recommended"

	],
	"overrides": [
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"react",
		"@typescript-eslint",
		"@emotion"
	],
	"rules": {
		"indent": "off",
		"@typescript-eslint/indent": ["error", "tab"],
		"linebreak-style": ["off"],
		"quotes": ["error", "double"],
		"semi": ["error", "always"],
		"react/no-unknown-property": ["error", {
			"ignore": ["css"]
		}],
		"react/no-unescaped-entities": ["warn"],
		"@emotion/jsx-import": ["error", {
			"runtime": "automatic"
		}],
		"@typescript-eslint/no-empty-interface": ["off"],
		"@typescript-eslint/no-empty-function": ["off"],
		"prefer-const": ["warn"],
		"no-debugger": ["warn"],
		"no-constant-condition": ["warn"]
	}
};
