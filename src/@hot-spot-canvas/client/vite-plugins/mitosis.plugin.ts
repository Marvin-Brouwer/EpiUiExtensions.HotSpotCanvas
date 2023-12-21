import path from 'path';
import { readFile } from 'node:fs/promises';
// TODO steal stuff from: https://github.com/vitejs/vite-plugin-vue2-jsx/blob/main/src/index.ts
// or any of these: https://vitejs.dev/plugins/
import { createFilter, type Plugin, type ResolvedConfig } from 'vite';

import { parseJsx, MitosisConfig, componentToReact, componentToVue2, componentToVue3, targets, getComponentFileExtensionForTarget } from '@builder.io/mitosis';

export const mitosisPlugin = (isDev: boolean, config: Partial<Omit<MitosisConfig, 'files'>> | Pick<MitosisConfig, 'targets'> = {}): Plugin => {

    const pluginName = 'vite:mitosis';

    let _config : ResolvedConfig;

    return ({
        name: pluginName,
		enforce: 'post',
		apply: 'build',

        configResolved(resolvedConfig) {
            _config = resolvedConfig
        },

        async transform(code, id) {

			if (id.includes('/node_modules/')) return

			const filter = createFilter(/\.lite\.tsx$/);
			const [filePath] = id.split('?')

            if (!filter(id) && !filter(filePath))
                return null;
				
			console.log('mitosis', id)



			// const presets = [
			// [jsx, {
			// 	compositionAPI: 'native',
			// 	...babelPresetOptions
			// }]
			// ]
			// plugins.push([
			// 	// @ts-ignore missing type
			// 	await import('@babel/plugin-transform-typescript').then(
			// 	(r) => r.default
			// 	),
			// 	// @ts-ignore
			// 	{ isTSX: true, allowExtensions: true, allowDeclareFields: true },
			// ])

			const originalFile = await readFile(id, { encoding: 'utf8' });
			const jsonTree = parseJsx(originalFile, { typescript: true });

			this.emitFile({
				fileName: path.basename(filePath)+'.tree.json',
				source: JSON.stringify(jsonTree, null, "	"),
				type: 'asset'
			})

			for (let targetKey of config.targets!) {
				const target = targets[targetKey]
				const extension = getComponentFileExtensionForTarget({ 
					target: targetKey,
					type: 'filename',
					isTypescript: true
				 });
				const transpiler = target({ typescript: true, api: targetKey === 'vue2' ? 'options' : 'composition', defineComponent: targetKey === 'vue3' })
				const transpiledComponent = transpiler({ component: jsonTree })
				
				this.emitFile({
					fileName: targetKey + '/'+path.basename(filePath).replace('.lite.tsx', extension),
					source: transpiledComponent,
					type: 'asset'
				})
			}


			return { code: 'undefined', moduleSideEffects: true };
        }
    });
};

export default mitosisPlugin;