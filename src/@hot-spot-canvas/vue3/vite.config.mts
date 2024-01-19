import { defineConfig } from 'vite';
import path from "path";
import vue from "@vitejs/plugin-vue";

const entry = path.resolve(__dirname, 'src/hotSpotCanvas.vue');

export default defineConfig({
	plugins: [vue()],
	build: {
	  lib: {
		entry,
		name: "HotSpotCanvas",
		// the name of the output files when the build is run
		fileName: "hot-spot-canvas",
	  },
	  rollupOptions: {
		// make sure to externalize deps that shouldn't be bundled
		// into your library
		external: ["vue"],
		output: {
		  // Provide global variables to use in the UMD build
		  // for externalized deps
		  globals: {
			vue: "Vue",
		  },
		},
	  },
	},
  });