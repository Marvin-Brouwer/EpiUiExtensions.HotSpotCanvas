import packageConfig from './package.json';
import path from 'path';
import { defineConfig } from 'vite';
import mitosis from './vite-plugins/mitosis.plugin';
import copy from 'rollup-plugin-copy';

const isDev = process.argv.join(' ').includes('--mode development');
const entry = path.resolve(__dirname, 'lib/hotSpotCanvas.lite.tsx');
const packageNameDefinition = packageConfig.name.split('/');
const packageName = packageNameDefinition[1];
const outputDir = 'output';

export default defineConfig({
	plugins: [
		mitosis(isDev, {
			targets: ['vue3', 'vue2', 'solid', 'svelte', 'react']
		}),
		copy({ 
			targets: [
				{ src: outputDir + '/vue3/*', dest: '../vue3/src'},
				{ src: outputDir + '/vue2/*', dest: '../vue2/src'},
				{ src: outputDir + '/solid/*', dest: '../solid/src'},
				{ src: outputDir + '/svelte/*', dest: '../svelte/src'},
				{ src: outputDir + '/react/*', dest: '../react/src'},
			]
		})
	],
	build: {
		outDir: outputDir,
		minify: !isDev,
		rollupOptions: {
			external: [
				'@builder.io/mitosis'
			],
			output: {
				format: "system",
				compact: !isDev,
				indent: isDev,
				sourcemap: isDev,
				preserveModules: false
			}
		},
		lib: {
			entry,
			name: packageName,
		}
	}
});