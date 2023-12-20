// UI Extension Framework --------------------------------------------------------
import { deepClone, valueEquals } from 'epi-ui-extensions';

// Internal components ----------------------------------------------------------
import { HotSpotEditorSettings } from '../data/EditorSettings';
import { HotSpotModel } from '../data/HotSpotModel';
import { log } from '../logger';

export type HotSpotEditorModel = ReturnType<typeof createEditorModel>;

export function createEditorModel(
	settings: HotSpotEditorSettings,
	initialValue: Array<HotSpotModel>,
	onChange: (hotSpots: Array<HotSpotModel | undefined>) => Promise<void>,
	onEditorChange: () => Promise<void>
) {

	let hotSpots: Array<HotSpotModel | undefined> = deepClone(initialValue);
	let hotSpots_dragging: Array<HotSpotModel | undefined> | undefined = deepClone(initialValue);

	let selectedIndex: number | undefined = undefined;
	let dragging: number | undefined = undefined;

	function getSelectedIndex(): number | undefined {
		return selectedIndex
	}
	async function setSelectedIndex(value: number) {
		if (settings.isReadonly) return;
		selectedIndex = value;
		await onEditorChange();
	}
	async function clearSelection() {
		selectedIndex = undefined;
		await onEditorChange();
	}

	function getDragging(index: number) {
		return dragging === index;
	}
	async function startDragging(index: number) {

		if (dragging !== undefined) return;
		if (settings.isReadonly) return;

		hotSpots_dragging = deepClone(hotSpots);
		dragging = index;

		await setSelectedIndex(index);
		await onEditorChange();
	}
	async function stopDragging(index: number) {

		if (dragging !== index) return;
		if (settings.isReadonly) return;

		dragging = undefined;

		await setSelectedIndex(index);
		await onEditorChange();

		let valueChanged = !valueEquals(hotSpots, hotSpots_dragging);

		// Fire onChange after drag
		if (valueChanged) {
			await onChange(hotSpots);
			hotSpots_dragging = undefined;
		}
	}

	function getHotSpots() {
		return hotSpots;
	}
	function getHotSpot(index: number) {
		return hotSpots[index];
	}
	async function setHotSpots(newHotspots: Array<HotSpotModel | undefined>) {

		let newValue = deepClone(newHotspots);

		const valueChanged = !valueEquals(hotSpots, newValue);

		hotSpots = newValue;

		await onEditorChange();

		// Skip saving while the drag is happening to prevent too many versions
		if (!dragging && valueChanged)
			await onChange(hotSpots);
	}
	async function setHotSpot(index: number, hotSpot: HotSpotModel) {

		let newValue = deepClone(hotSpots);
		newValue[index] = deepClone(hotSpot);

		await setHotSpots(newValue);
	}
	async function removeHotSpot(index: number) {

		let newValue = deepClone([
			...hotSpots
		]);
		newValue[index] = undefined;
		newValue = newValue.sort((a, b) => {
			if (a === undefined && b === undefined) return 0;
			if (a !== undefined && b !== undefined) return 0;
			if (a === undefined && b !== undefined) return -1;
			if (a !== undefined && b === undefined) return 1;

			return 0;
		})

		await clearSelection();
		await setHotSpots(newValue);
	}
	async function addHotSpot(contentReference: string, coordinateX: number = 0, coordinateY: number = 0) {

		const newHotSpot: HotSpotModel = {
			contentReference,
			// Issue:#9 randomize if already a hotSpot in 0,0
			coordinates: {
				x: coordinateX, y: coordinateY
			}
		}

		const availableSlot = hotSpots.findIndex(hotSpot => !hotSpot);
		if (availableSlot === -1) {
			log.error('handleHotspotAdded', 'no slot available', newHotSpot);
			return;
		}

		await setSelectedIndex(availableSlot);
		await setHotSpot(availableSlot, newHotSpot);
	}

	return {
		settings,

		getSelectedIndex,
		setSelectedIndex,
		clearSelection,
		getDragging,
		startDragging,
		stopDragging,

		getHotSpots,
		setHotSpots,
		getHotSpot,
		addHotSpot,
		setHotSpot,
		removeHotSpot
	}
}