import { defineConfig } from 'vite';
import path from "path";

import vue from "@vitejs/plugin-vue2";
import dts from 'vite-plugin-dts';

const isDev = process.argv.join(' ').includes('--mode development');

const srcFolder = path.resolve(__dirname, 'src');
const entry = path.resolve(srcFolder, 'hotSpotCanvas.vue');

export default defineConfig({
	plugins: [
		vue(), 
		dts({ 
			entryRoot: srcFolder, 
			cleanVueFileName: true
		})
	],
	build: {
		minify: !isDev,
		lib: {
		entry,
		name: "HotSpotCanvas",
		fileName: "hotSpotCanvas",
		formats: ['cjs', 'es', 'umd']
		},
		rollupOptions: {
		// make sure to externalize deps that shouldn't be bundled
		// into your library
		external: ["vue"],
		output: {
			compact: !isDev,
			indent: isDev,
			sourcemap: isDev,
			// Provide global variables to use in the UMD build
			// for externalized deps
			globals: {
			vue: "Vue",
			},
		},
		},
	},
});