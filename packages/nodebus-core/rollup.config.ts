import pkg from './package.json';
import { swc, defineRollupSwcOption } from 'rollup-plugin-swc3';
import type { RollupOptions } from 'rollup';

const config: RollupOptions =
    // CommonJS (for Node) & ESM (for bundlers)
    {
        input: 'src/index.ts',
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
        plugins: [
            swc(
                defineRollupSwcOption({
                    minify: false,
                    sourceMaps: true,
                }),
            ),
        ],
    };

export default config;
