import { defineConfig } from "./mitosis.plugin";

export default defineConfig({
    dest: 'dist',
    targets: ['vue3', 'vue2', 'solid', 'svelte', 'react'],
    getTargetPath: ({ target }) => target,
    options: {
        vue2: { 
            // Composition api doesn't seem to work very well with mitosis
            api: 'options',
            defineComponent: false
        },
        vue3: { 
            // Composition api doesn't seem to work very well with mitosis
            api: 'options',
            defineComponent: true
        },
    },
    commonOptions: {
        typescript: true
    }
})