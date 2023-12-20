/// <reference path="../../env.d.ts" />

// Dojo components --------------------------------------------------------------
import DndManager from "dojo/dnd/Manager";
import on from 'dojo/on';
import lang from 'dojo/_base/lang';
import type { EventUnsubscribe } from 'dojo/_base/lang';

// Optimizely components --------------------------------------------------------
import ContentSelector from 'epi-cms/widget/ContentSelector';

// Internal components ----------------------------------------------------------
import 'xstyle/css!./hotSpotDisplayContainer.css';

import { HotSpotEditorModel } from './hotSpotEditorModel';
import { createHotSpotDisplay } from './hotSpotDisplay';
import { createEmptyHotSpotArray } from "../util/arrays";
import { mapAllowedReferences } from "../util/epi";
import { HotSpotEditorSettings } from "../data/EditorSettings";

export type HotSpotDisplayContainer = ReturnType<typeof createHotSpotDisplayContainer>;

export function createHotSpotDisplayContainer(
	hotSpotContainer: HTMLDivElement,
	editorState: HotSpotEditorModel
) {

	const { settings } = editorState;

	let hotSpotDropListener: EventUnsubscribe | undefined;

	hotSpotContainer.setAttribute('data-readOnly', settings.isReadonly.toString());
	hotSpotContainer.style.width = `${settings.canvasWidth + (settings.offset * 2)}px`;
	hotSpotContainer.style.height = `${settings.canvasHeight + (settings.offset * 2)}px`;

	const hotSpotDefinitions = createEmptyHotSpotArray(settings).map((_, index) => {

		return createHotSpotDisplay(
			index, hotSpotContainer, editorState
		);
	});

	if (!settings.isReadonly) {

		const manager = ((DndManager as any).manager() as typeof DndManager.prototype);
		const displayContentSelector: typeof ContentSelector = new ContentSelector({
			title: "Drop content item",
			class: "drop-content-selector",
			readOnly: settings.isReadonly,
			searchArea: [settings.contentRepositoryDescriptors["pages"].searchArea, settings.contentRepositoryDescriptors["catalog"].searchArea].join(','),
			roots: settings.contentRepositoryDescriptors["pages"].roots,
			allowedTypes: [...settings.supportedPageTypes, ...settings.supportedCatalogTypes],
			repositoryKey: 'media',
			allowedDndTypes: mapAllowedReferences(settings),
		});
		displayContentSelector.set('style', {
			width: `${settings.canvasWidth}px`,
			height: `${settings.canvasHeight}px`,
			margin: `${settings.offset}px`
		});

		displayContentSelector.placeAt(hotSpotContainer, 0);
		async function onDrop() {
			// This shouldn't happen but it's good to verify
			if (!displayContentSelector.value) return

			// EPiServer shows the avatar next to mouse pos, not exactly on mouse pos
			const epiServerAvatarOffset = 5;

			// Use the drag avatar as mouse positioning since we don't have event context in dojo.on
			const boundingBox = ((manager as any).avatar.node as HTMLElement).getBoundingClientRect();
			const { coordinateX, coordinateY } = calculatePosition(settings, hotSpotContainer, boundingBox.x, boundingBox.y);

			await editorState.addHotSpot(
				displayContentSelector.value,
				coordinateX - epiServerAvatarOffset,
				coordinateY - epiServerAvatarOffset
			);
		}
		hotSpotDropListener = on(displayContentSelector, 'drop', lang.hitch(displayContentSelector, onDrop), true);
	}

	function disconnect() {
		hotSpotDropListener?.remove();
		hotSpotDefinitions.forEach(definition => definition.disconnect());
	}

	function onChange() {

		for(let definitionIndex in hotSpotDefinitions) {
			const definition = hotSpotDefinitions[definitionIndex];

			definition.onChange()
		}
	}

	async function onEditorChange() {

		for(let definitionIndex in hotSpotDefinitions) {
			const definition = hotSpotDefinitions[definitionIndex];

			await definition.onEditorChange()
		}
	}

	return {
		onChange,
		onEditorChange,
		disconnect
	}
}

export function calculatePosition(settings: HotSpotEditorSettings, hotSpotContainer: HTMLElement, mouseX: number, mouseY: number) {

	const roundingFactor = 100;
	const hotSpotSize = 20;
	const hotSpotCenterOffset = hotSpotSize / 2;
	const backdropBorderPadding = 2;

	// Because this thing isn't usable on start, we just as well might just resolve it when we need it.
	const boundingBox = hotSpotContainer.getBoundingClientRect();

	const relativeX = (mouseX - boundingBox.x) - hotSpotCenterOffset;
	const relativeY = (mouseY - boundingBox.y) - hotSpotCenterOffset;

	const minWidth = (settings.offset + backdropBorderPadding) - hotSpotCenterOffset;
	const maxWidth = (settings.canvasWidth + (settings.offset - backdropBorderPadding)) - hotSpotCenterOffset;

	const boundX = () => {

		if (relativeX <= minWidth) return minWidth;
		if (relativeX >= maxWidth) return maxWidth;

		return (Math.round(relativeX * roundingFactor) / roundingFactor);
	};

	const boundY = () => {
		const minHeight= (settings.offset + backdropBorderPadding) - hotSpotCenterOffset;
		const maxHeight = (settings.canvasHeight + (settings.offset - backdropBorderPadding)) - hotSpotCenterOffset;

		if (relativeY <= minHeight) return minHeight;
		if (relativeY >= maxHeight) return maxHeight;

		return (Math.round(relativeY * roundingFactor) / roundingFactor);
	};

	const coordinateX = boundX();
	const coordinateY = boundY();

	return {
		coordinateX,
		coordinateY
	}
}