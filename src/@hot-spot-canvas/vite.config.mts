import { defineConfig } from 'vite';
import multiple from 'vite-plugin-multiple'

export default defineConfig({
	plugins: [
		multiple([
			// Separate component
			{
				name: '@hot-spot-canvas/cms',
				config: './cms/vite.config.mts',
			},
			// Build mitosis
			{
				name: '@hot-spot-canvas/cms',
				config: './cms/vite.config.mts',
			},
			// Compile specialized components
			{
				name: '@hot-spot-canvas/vue2',
				config: './vue2/vite.config.mts',
			},
		]),
	],
});