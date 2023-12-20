import './hotspotDefinitionList.css';
import { createEmptyHotSpotArray } from '../util/arrays';
import { createHotSpotDefinition } from './hotSpotDefinition';

import { HotSpotEditorModel } from './hotSpotEditorModel';

export type HotSpotDefinitionList = ReturnType<typeof createHotSpotDefinitionList>;

export function createHotSpotDefinitionList(
	hotSpotListContainer: HTMLDivElement,
	editorState: HotSpotEditorModel
) {

	const hotSpotList = document.createElement('ul');
	hotSpotList.className = 'hotspot-list';
	hotSpotListContainer.append(hotSpotList);

	const hotSpotDefinitions = createEmptyHotSpotArray(editorState.settings).map((_, index) => {

		return createHotSpotDefinition(
			editorState, index, hotSpotList
		);
	});

	function disconnect() {
		hotSpotDefinitions.forEach(definition => definition.disconnect());
	}

	async function onChange() {

		for(let definitionIndex in hotSpotDefinitions) {

			const definition = hotSpotDefinitions[definitionIndex];
			await definition.onChange()
		}
	}

	async function onEditorChange() {

		for(let definitionIndex in hotSpotDefinitions) {
			const definition = hotSpotDefinitions[definitionIndex];

			await definition.onEditorChange();
		}
	}

	return {
		onChange,
		onEditorChange,
		disconnect
	}
}