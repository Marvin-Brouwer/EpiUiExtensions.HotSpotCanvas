import packageConfig from './package.json';
import tsConfig from './tsconfig.json';
import path from 'path';
import { defineConfig } from 'vite';
import mitosis from './vite-plugins/mitosis.plugin';
import ts from 'vite-plugin-typescript';

const isDev = process.argv.join(' ').includes('--mode development');
const entry = path.resolve(__dirname, 'lib/hotSpotCanvas.lite.tsx');
const packageNameDefinition = packageConfig.name.split('/');
const packageName = packageNameDefinition[1];
const outputDir = 'output';

export default defineConfig({
	plugins: [
		ts(),
		mitosis(isDev, {
			targets: ['vue3', 'vue2', 'solid', 'svelte', 'react']
		}),
	],
	build: {
		outDir: outputDir,
		minify: !isDev,
		rollupOptions: {
			external: [
				/^vue/s,
				/^\@vue\//s,
				/registry\.npmjs\.org/s,
				/^\@vitejs\//s,
				'vue',
				'vue-class-component',
				'vue-property-decorator',
				'vuex',
				'vuex-class',
				'@builder.io/mitosis'
			],
			output: {
				compact: !isDev,
				indent: isDev,
				sourcemap: isDev,
				preserveModules: false,
				globals: {
					vue: "Vue",
				},
			}
		},
		lib: {
			entry,
			name: packageName,
		}
	}
});