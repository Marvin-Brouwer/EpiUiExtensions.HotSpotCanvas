import { HotSpotDefinitionList, createHotSpotDefinitionList } from './hotSpotDefinitionList';
import { HotSpotEditorModel, createEditorModel } from './hotSpotEditorModel';
import { HotSpotDisplayContainer, createHotSpotDisplayContainer } from './hotSpotDisplayContainer';
import { HotSpotInsertPanel, createHotSpotInsertPanel } from './hotSpotInsertPanel';
import { HotSpotModel } from '../data/HotSpotModel';
import { HotSpotEditorSettings } from '../data/EditorSettings';

export function createHotSpotEditor() {

	let currentEditorState: HotSpotEditorModel;
	let hotSpotDisplay: HotSpotDisplayContainer;
	let hotSpotList: HotSpotDefinitionList;
	let hotSpotInsertPanel: HotSpotInsertPanel;

	function connect(
		listElement: HTMLDivElement, hotSpotContainer: HTMLDivElement, insertContainer: HTMLDivElement,
		initialValue: Array<HotSpotModel>, settings: HotSpotEditorSettings,

		onValueChange: (hotSpots: Array<HotSpotModel | undefined>) => Promise<void>
	) {

		async function onInnerValueChange(value: Array<HotSpotModel | undefined>) {

			await onChange();
			await onValueChange(value);
		}

		currentEditorState = createEditorModel(settings, initialValue, onInnerValueChange, onEditorStateChange);

		hotSpotDisplay = createHotSpotDisplayContainer(
			hotSpotContainer, currentEditorState
		);
		hotSpotList = createHotSpotDefinitionList(
			listElement, currentEditorState
		);
		hotSpotInsertPanel = createHotSpotInsertPanel(
			insertContainer, currentEditorState
		);

		window.addEventListener('mousedown', blurEditor)
	}

	function disconnect() {
		hotSpotDisplay.disconnect();
		hotSpotList.disconnect();
		hotSpotInsertPanel.disconnect();

		window.removeEventListener('mousedown', blurEditor)
	}

	async function onEditorStateChange() {

		await Promise.all([
			hotSpotDisplay.onEditorChange(),
			hotSpotList.onEditorChange()
		]);
	}
	async function onChange() {

		await Promise.all([
			hotSpotDisplay.onChange(),
			hotSpotList.onChange(),
			hotSpotInsertPanel.onChange()
		]);
	}

	async function setValue(value: Array<HotSpotModel>) {

		// No need for equality checks, is done inside containers
		await currentEditorState.setHotSpots(value);
	}

	async function blurEditor() {

		currentEditorState.clearSelection();
	}

	return {
		setValue,
		connect,
		disconnect
	}
}