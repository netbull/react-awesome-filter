import babel from '@rollup/plugin-babel';
import del from 'rollup-plugin-delete';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import url from 'postcss-url';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';

export default {
	input: pkg.source,
	output: [
		{file: pkg.main, format: 'cjs'},
		{file: pkg.module, format: 'esm'}
	],
	plugins: [
		postcss({
			// extract: true,
			to: 'semantic-ui-react-date-picker.css',
			plugins: [
				url({
					url: "inline", // enable inline assets using base64 encoding
					maxSize: 10, // maximum file size to inline (in kilobytes)
				}),
			],
		}),
		babel({
			exclude: 'node_modules/**',
			babelHelpers: 'bundled',
			presets: ['@babel/env', '@babel/preset-react']
		}),
		resolve({
			preferBuiltins: false,
		}),
		commonjs({
			include: 'node_modules/**',
		}),
		del({targets: ['dist/*']}),
	],
	external: Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies)),
};
