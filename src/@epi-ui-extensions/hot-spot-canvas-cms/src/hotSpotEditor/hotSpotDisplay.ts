import 'xstyle/css!./hotSpotDisplay.css';

import { HotSpotEditorModel } from './hotSpotEditorModel';
import { calculatePosition } from './hotSpotDisplayContainer';

export function createHotSpotDisplay(
	index: number, hotSpotContainer: HTMLDivElement,
	editorState: HotSpotEditorModel
) {

	let definitionIndex: number;
	const { settings } = editorState;

	definitionIndex = index;
	const hotSpot = () => editorState.getHotSpot(definitionIndex);
	const selected = () => hotSpot() && (definitionIndex == editorState.getSelectedIndex());
	const dragging = () => editorState.getDragging(definitionIndex);

	const hotSpotDefinition = document.createElement('div');
	hotSpotDefinition.className = 'hot-spot-display-indicator';
	hotSpotDefinition.style.color = `#${settings.hotSpotColors[index]}`;
	updateDisplay();
	hotSpotDefinition.addEventListener('mousedown', selectCurrent);
	hotSpotDefinition.addEventListener('mousedown', dragStart);
	window.addEventListener('mouseup', dragEnd);
	hotSpotContainer.append(hotSpotDefinition);

	async function selectCurrent() {

		if (settings.isReadonly) return;

		await editorState.setSelectedIndex(definitionIndex);
		updateDisplay();
	}

	async function onDrag(e: MouseEvent) {

		if (settings.isReadonly) return;

		const { coordinateX, coordinateY } = calculatePosition(settings, hotSpotContainer, e.pageX, e.pageY);
		hotSpotDefinition.style.left = `${coordinateX}px`
		hotSpotDefinition.style.top = `${coordinateY}px`

		let newValue = {
			...hotSpot()!
		};
		newValue.coordinates.x = coordinateX;
		newValue.coordinates.y = coordinateY;

		await editorState.setHotSpot(definitionIndex, newValue);
	}

	async function dragStart(e: MouseEvent) {
		e.preventDefault();
		if (settings.isReadonly) return;

		await editorState.startDragging(definitionIndex);
		updateDisplay();

		window.addEventListener('mousemove', onDrag);
		await onDrag(e);
	}

	async function dragEnd(e: MouseEvent) {
		e.preventDefault();
		if (settings.isReadonly) return;

		hotSpotDefinition.style.left = '';
		hotSpotDefinition.style.top = '';

		window.removeEventListener('mousemove', onDrag);

		await editorState.stopDragging(definitionIndex);
		updateDisplay();
	}

	function updateDisplay() {

		hotSpotDefinition.style.display = !!hotSpot() ? '' : 'none';
		hotSpotDefinition.style.borderColor = selected() || dragging() ? `#${settings.hotSpotColors[definitionIndex]}` : '';
		hotSpotDefinition.setAttribute('data-selected', selected() || dragging() ? 'true' : 'false');
		hotSpotDefinition.setAttribute('data-dragging', dragging() ? 'true' : 'false');

		if (!hotSpot()) return;

		const { x, y } = hotSpot()!.coordinates;
		hotSpotDefinition.style.left = `${x}px`;
		hotSpotDefinition.style.top = `${y}px`;
	}

	function disconnect() {
		hotSpotDefinition.removeEventListener('mousedown', selectCurrent);
		hotSpotDefinition.removeEventListener('mousedown', dragStart);
		window.removeEventListener('mousemove', onDrag);
		window.removeEventListener('mouseup', dragEnd);
		hotSpotDefinition.remove();
	}

	function onChange() {
		updateDisplay();
	}

	function onEditorChange() {
		updateDisplay();
	}

	return {
		onChange,
		onEditorChange,
		disconnect
	}
}