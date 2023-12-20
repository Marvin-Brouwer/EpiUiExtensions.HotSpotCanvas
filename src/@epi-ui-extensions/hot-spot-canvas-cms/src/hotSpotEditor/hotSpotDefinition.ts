// Dojo components --------------------------------------------------------------
import NumberSpinner from 'dijit/form/NumberSpinner';
import Button from 'dijit/form/Button';

// UI Extension Framework --------------------------------------------------------
import { deepClone } from 'epi-ui-extensions';

// Internal components ----------------------------------------------------------
import 'xstyle/css!./hotSpotDefinition.css';

import { log } from '../logger';
import { HotSpotEditorModel } from './hotSpotEditorModel';
import { createHotSpotContentSelector } from './hotSpotContentSelector';

type NumberSpinner = typeof NumberSpinner.prototype & dijit._Widget & {
	"upArrowNode": HTMLElement,
	"downArrowNode": HTMLElement,
	"textbox": HTMLElement,
	"focusNode": HTMLElement
};
type DijitButton = typeof Button.prototype & dijit._Widget & {
	valueNode: HTMLInputElement
};

export type HotspotDefinition = ReturnType<typeof createHotSpotDefinition>;

export function createHotSpotDefinition(
	editorState: HotSpotEditorModel, index: number, hotSpotList: HTMLUListElement
) {

	let definitionIndex: number;
	const { settings } = editorState;

	definitionIndex = index;
	const hotSpot = () => editorState.getHotSpot(definitionIndex);
	const selected = () => hotSpot() && (definitionIndex == editorState.getSelectedIndex());
	const dragging = () => editorState.getDragging(definitionIndex);

	const hotSpotDefinition = document.createElement('li');
	hotSpotDefinition.className = 'hot-spot-list-definition dijitInline epi-content-area-editor dojoDndTargetDisabled';
	hotSpotDefinition.tabIndex = -1;
	hotSpotDefinition.addEventListener('click', selectCurrent);
	updateDisplay();
	hotSpotList.append(hotSpotDefinition);

	const colorIndicator = document.createElement('span');
	colorIndicator.className = 'color-indicator';
	colorIndicator.style.color = `#${settings.hotSpotColors[index]}`;
	hotSpotDefinition.append(colorIndicator);

	const xPositionInput: NumberSpinner = new NumberSpinner({
		intermediateChanges: !settings.isReadonly,
		value: hotSpot()?.coordinates.x ?? 0,
		readOnly: settings.isReadonly,
		disabled: settings.isReadonly,
		focusable: !settings.isReadonly,
		constraints:{
			max: settings.canvasWidth,
			min: 0
		}
	}) as NumberSpinner;

	const unregisterXFix = registerSpinnerFix(xPositionInput);
	const xChangeListener = xPositionInput.on('change', (xValue: number) => {
		if (settings.isReadonly) return;
		if (!hotSpot()) return;
		if (xValue === hotSpot()?.coordinates.x) return;

		let newValue = {
			...deepClone(hotSpot())
		}
		newValue.coordinates.x = xValue;

		editorState.setHotSpot(definitionIndex, newValue)
			.then(() => selectCurrent())
			.then(() => xPositionInput.textbox.focus({ preventScroll: true }))
			.catch(ex => log.error(ex));
	});
	xPositionInput.placeAt(hotSpotDefinition);

	const yPositionInput: NumberSpinner = new NumberSpinner({
		intermediateChanges: !settings.isReadonly,
		value: hotSpot()?.coordinates.y ?? 0,
		readOnly: settings.isReadonly,
		disabled: settings.isReadonly,
		focusable: !settings.isReadonly,
		constraints:{
			max: settings.canvasHeight,
			min: 0
		}
	}) as NumberSpinner;

	const unregisterYFix = registerSpinnerFix(yPositionInput);
	const yChangeListener = yPositionInput.on('change', (yValue: number) => {
		if (settings.isReadonly) return;
		if (!hotSpot()) return;
		if (yValue === hotSpot()?.coordinates.y) return;

		let newValue = {
			...deepClone(hotSpot())
		}
		newValue.coordinates.y = yValue;

		editorState.setHotSpot(definitionIndex, newValue)
			.then(() => selectCurrent())
			.then(() => yPositionInput.textbox.focus({ preventScroll: true }))
			.catch(ex => log.error(ex));
	});
	yPositionInput.placeAt(hotSpotDefinition);

	const contentSelector = createHotSpotContentSelector(
		editorState.settings,
		hotSpot()?.contentReference, hotSpotDefinition,
		async (contentReference) => {

		if (!hotSpot()) return;
		if (hotSpot()?.contentReference === contentReference) return;

		await selectCurrent();
		await editorState.setHotSpot(index, {
			...hotSpot()!,
			contentReference: contentReference
		});
	});

	const deleteButton: DijitButton = new Button({
		title: "Delete hotSpot",
		label: "Delete hotSpot",
		class: "delete-button",
		showLabel: false,
		readOnly: settings.isReadonly,
		iconClass:'dijitIcon dijitMenuItemIcon epi-iconTrash',
		onClick: async (e: MouseEvent) => {
			if (settings.isReadonly) return;

			// Prevent select from happening
			e.stopImmediatePropagation();
			e.stopPropagation();
			e.preventDefault();

			editorState.clearSelection();

			await editorState.removeHotSpot(definitionIndex);
		}
	}) as DijitButton;
	deleteButton.placeAt(hotSpotDefinition);

	function isButtonNode(target: EventTarget, input: NumberSpinner): boolean {

		if (target === input.domNode) return true;
		if (target === input.upArrowNode) return true;
		if (target === input.downArrowNode) return true;
		if (target === input.textbox) return true;
		if (target === input.focusNode) return true;

		if (input.domNode.contains(target as Node)) return true;

		return false
	}

	async function selectCurrent(e?: Event) {

		if (settings.isReadonly) return;
		// Don't select on delete click
		if (e && e.target === deleteButton.valueNode) return;
		// This function cancels update, and the position inputs select current on change anyway
		if (e && isButtonNode(e.target!, xPositionInput)) return;
		if (e && isButtonNode(e.target!, yPositionInput)) return;

		await editorState.setSelectedIndex(definitionIndex);
		updateDisplay();
	}

	function updateDisplay() {

		hotSpotDefinition.style.display = !!hotSpot() ? '' : 'none';
		hotSpotDefinition.style.borderColor = selected() || dragging() ? `#${settings.hotSpotColors[definitionIndex]}` : '';
		hotSpotDefinition.setAttribute('data-selected', selected() || dragging() ? 'true' : 'false');

		if (selected() && !editorState.getDragging(definitionIndex)) {
			hotSpotDefinition.focus({ preventScroll: true });
		}
	}

	function registerSpinnerFix(spinner: NumberSpinner) {

		function checkFocus() {
			if (!spinner.focusNode) spinner.focusNode = spinner.textbox;
			if (!settings.isReadonly) return;

			// DIJIT focussed=false didn't work properly
			spinner.textbox.focus({ preventScroll: true });;
			spinner.textbox.blur();
		}

		const spinnerFocusListener = spinner.on('focus', checkFocus);
		const spinnerClickListener = spinner.on('click', checkFocus);
		spinner.textbox.addEventListener('focus', checkFocus);
		spinner.textbox.addEventListener('select', checkFocus);

		function startDrag() {
			if (!spinner.focusNode) spinner.focusNode = spinner.textbox;
			if (settings.isReadonly) return;

			editorState.startDragging(definitionIndex);
		}
		function stopDrag() {
			if (!spinner.focusNode) spinner.focusNode = spinner.textbox;
			if (settings.isReadonly) return;

			editorState.stopDragging(definitionIndex);
		}

		function addOne(ev: MouseEvent){
			if (!spinner.focusNode) spinner.focusNode = spinner.textbox;
			if (settings.isReadonly) {
				ev.preventDefault();
				ev.stopImmediatePropagation();
				ev.stopPropagation();
				return false;
			}

			setValue(spinner, spinner.value as any + 1)
		}
		function subtractOne(ev: MouseEvent){
			if (!spinner.focusNode) spinner.focusNode = spinner.textbox;
			if (settings.isReadonly) {
				ev.preventDefault();
				ev.stopImmediatePropagation();
				ev.stopPropagation();
				return false;
			}

			setValue(spinner, spinner.value as any - 1)
		}

		spinner.upArrowNode.addEventListener('mousedown', startDrag);
		spinner.upArrowNode.addEventListener('click', addOne);
		spinner.upArrowNode.addEventListener('mouseup', stopDrag);
		spinner.downArrowNode.addEventListener('mousedown', startDrag);
		spinner.downArrowNode.addEventListener('click', subtractOne);
		spinner.downArrowNode.addEventListener('mouseup', stopDrag);

		return function unRegisterSpinnerFix() {
			spinnerFocusListener.remove();
			spinnerClickListener.remove();

			spinner.textbox.removeEventListener('focus', checkFocus);
			spinner.textbox.removeEventListener('select', checkFocus);
			spinner.upArrowNode.removeEventListener('mousedown', startDrag);
			spinner.upArrowNode.removeEventListener('click', addOne);
			spinner.upArrowNode.removeEventListener('mouseup', stopDrag);
			spinner.downArrowNode.removeEventListener('mousedown', startDrag);
			spinner.downArrowNode.removeEventListener('click', subtractOne);
			spinner.downArrowNode.removeEventListener('mouseup', stopDrag);
		}
	}


	function disconnect() {
		xChangeListener.remove();
		yChangeListener.remove();

		colorIndicator.remove();
		hotSpotDefinition.remove();
		hotSpotDefinition.removeEventListener('click', selectCurrent);
		unregisterXFix();
		xPositionInput.destroy();
		unregisterYFix();
		yPositionInput.destroy();
		contentSelector.disconnect();
		deleteButton.destroy();
	}

	async function onChange() {

		setValue(xPositionInput, hotSpot()?.coordinates.x ?? 0)
		setValue(yPositionInput, hotSpot()?.coordinates.y ?? 0)

		await contentSelector.setValue(hotSpot()?.contentReference);

		updateDisplay();
	}

	async function onEditorChange() {

		setValue(xPositionInput, hotSpot()?.coordinates.x ?? 0)
		setValue(yPositionInput, hotSpot()?.coordinates.y ?? 0)

		updateDisplay();
	}

	function setValue(spinner: NumberSpinner, value: number | undefined) {
		if (!spinner.focusNode) spinner.focusNode = spinner.textbox;

		try{
			spinner.set('value', value ?? 0);
		} catch(err) {
			if (err.message !== 'this.focusNode is undefined') throw err;

			// This doesn't seem to matter really but it's also not preventable
			// When switching between readonly and non-readonly the focusNode becomes undefined
			// As you can see we try to set that when it's not accessible but this doesn't seem to help all of the time.
		}
	}

	return {
		onChange,
		onEditorChange,
		disconnect
	}
}