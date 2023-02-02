const pkg = require('./package.json', { assert: { type: 'json' } });
const { swc, defineRollupSwcOption } = require('rollup-plugin-swc3');
// const externals = require('rollup-plugin-node-externals');

const config =
	// CommonJS (for Node) & ESM (for bundlers)
	{
		input: 'src/index.ts',
		output: [
			{ file: pkg.main, format: 'cjs', sourcemap: false },
			{ file: pkg.module, format: 'es', sourcemap: false },
		],
		plugins: [
			// typescriptPaths({ preserveExtensions: true }),
			// externals(),
			swc(
				defineRollupSwcOption({
					minify: true,
					tsconfig: './tsconfig.build.json',
					jsc: {
						minify: {
							mangle: false,
							compress: true,
						},
						experimental: {
							keepImportAssertions: true,
						},
					},
				}),
			),
		],
		external: [
			'node:events',
			'regenerator-runtime',
			'pino',
			'pino-pretty',
			'@carbonteq/hexapp',
			'node:crypto',
		],
	};

module.exports = config;
