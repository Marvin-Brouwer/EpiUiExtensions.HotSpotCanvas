import path from 'path';
import { readFile } from 'node:fs/promises';
// TODO steal stuff from: https://github.com/vitejs/vite-plugin-vue2-jsx/blob/main/src/index.ts
// or any of these: https://vitejs.dev/plugins/ to make imports work
import { createFilter, type Plugin, type ResolvedConfig } from 'vite';

import { parseJsx, MitosisConfig, targets, getComponentFileExtensionForTarget } from '@builder.io/mitosis';

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

        async transform(_code, id) {

			if (id.includes('/node_modules/')) return

			const filter = createFilter(/\.lite\.tsx$/);
			const [filePath] = id.split('?')

            if (!filter(id) && !filter(filePath))
                return null;
				
			console.log('mitosis', id)

			const originalFile = await readFile(id, { encoding: 'utf8' });
			const jsonTree = parseJsx(originalFile, { typescript: true });

			if (isDev)
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
					fileName: targetKey + '/' + path.basename(filePath).replace('.lite.tsx', extension),
					source: transpiledComponent,
					type: 'asset'
				})
			}


			return { code: 'undefined', moduleSideEffects: true };
        }
    });
};

export default mitosisPlugin;