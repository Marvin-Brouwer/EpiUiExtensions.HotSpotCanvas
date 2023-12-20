import packageConfig from './package.json';
import tsConfig from './tsconfig.json';
import path from 'path';
import { defineConfig } from 'vite';
import amd from 'rollup-plugin-amd';

const isDev = process.argv.join(' ').includes('--mode development');
const entry = path.resolve(__dirname, 'src/index.ts');
const packageNameDefinition = packageConfig.name.split('/');
const packageName = packageNameDefinition[1];
const outputDir = 'dist';

export default defineConfig({
	plugins: [
		amd(),
	],
	build: {
		minify: !isDev,
		target: [tsConfig.compilerOptions.target],
		outDir: outputDir,
		rollupOptions: {
			external: [
				/^dijit\//s,
				/^dojo\//s,
				/^epi\//s,
				/^epi\-cms\//s,
				/^xstyle\//s
			],
			output: {
				format: "amd",
				strict: false,
				chunkFileNames: `[name].amd.js`,
				entryFileNames: "[name].js",
				dir: "dist",
				compact: !isDev,
				indent: isDev,

				dynamicImportInCjs: false,
				externalImportAssertions: false,
				inlineDynamicImports: false,
				preserveModules: false,

				interop: 'default'
			}
		},
		lib: {
			entry,
			name: packageName,
			fileName: () => `index.js`
		}
	}
});