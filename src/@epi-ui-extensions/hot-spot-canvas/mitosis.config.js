/** @type {import('@builder.io/mitosis').MitosisConfig} */
module.exports = {
    files: 'lib/*',
    dest: 'dist',
    targets: ['vue3', 'vue2', 'solid', 'svelte', 'react'],
    getTargetPath: ({ target }) => target,
    options: {
        vue2: { 
            api: 'composition'
        }
    }
};