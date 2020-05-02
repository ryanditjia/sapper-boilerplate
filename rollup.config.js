import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import path from 'path'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'
import sveltePreprocessPostcss from 'svelte-preprocess-postcss'
import pkg from './package.json'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = !!process.env.SAPPER_LEGACY_BUILD

const onwarn = (warning, onwarn) =>
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	onwarn(warning)

// Make Svelte style work with Tailwind’s @apply
const stylePreprocessor = sveltePreprocessPostcss()

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
			}),
			svelte({
				dev,
				hydratable: true,
				preprocess: {
					style: stylePreprocessor,
				},
				emitCss: true,
			}),
			resolve({
				browser: true,
				dedupe: ['svelte'],
			}),
			commonjs(),

			legacy &&
				babel({
					extensions: ['.js', '.mjs', '.html', '.svelte'],
					runtimeHelpers: true,
					exclude: ['node_modules/@babel/**'],
					presets: [
						[
							'@babel/preset-env',
							{
								targets: '> 0.25%, not dead',
							},
						],
					],
					plugins: [
						'@babel/plugin-syntax-dynamic-import',
						[
							'@babel/plugin-transform-runtime',
							{
								useESModules: true,
							},
						],
					],
				}),

			!dev &&
				terser({
					module: true,
				}),
		],

		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode),
			}),
			svelte({
				generate: 'ssr',
				dev,
				preprocess: {
					style: stylePreprocessor,
				},
			}),
			postcss({
				// Tailwind
				minimize: !dev,
				extract: path.resolve(__dirname, './static/global.css'),
			}),
			resolve({
				dedupe: ['svelte'],
			}),
			commonjs(),
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives')),
		),

		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
			}),
			commonjs(),
			!dev && terser(),
		],

		onwarn,
	},
}
