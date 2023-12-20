/// <reference path="../../env.d.ts" />

// Optimizely components --------------------------------------------------------
import dependency from 'epi/dependency';
import { MediaItem } from 'epi/dependency/_types';

// UI Extension Framework --------------------------------------------------------
import { editorComponent, deepClone, valueEquals, ComponentFactory } from 'epi-ui-extensions';

// Internal components ----------------------------------------------------------
import template from './editor.html?raw';
import 'xstyle/css!./editor.css';

import { moduleNameSpace, componentName } from '../constants';
import { log } from '../logger';

import { HotSpotCanvasModel, HotSpotModel, initializeHotSpotCanvas } from '../data/HotSpotModel';
import { createEmptyHotSpotArray } from '../util/arrays';
import { createEditorSettings } from '../data/EditorSettings';

import { createImageSelector } from '../imageSelector/imageSelector';
import { createHotSpotEditor } from '../hotSpotEditor/hotSpotEditor';

const canvasEditorComponent = (component: ComponentFactory<HotSpotCanvasModel>) => 
    editorComponent<HotSpotCanvasModel>(moduleNameSpace, componentName, template, component)

export default canvasEditorComponent(({ updateValue, element, getConfig, propertyName, isReadonly }) => {

	const contentLoader = () => dependency.resolve("epi.storeregistry").get("epi.cms.contentdata");
	let settings = createEditorSettings(propertyName, isReadonly, getConfig);
	let currentValue = initializeHotSpotCanvas(settings);

	if (settings.supportedPageTypes.length === 0 &&
		settings.supportedCatalogTypes.length === 0) {
			log.warn(`The property with name ${propertyName} has no configured items to select`);
		}

	let backdropSelector = createImageSelector('backdrop-selector', settings);
	const hotSpotEditor = createHotSpotEditor();

	function setCanvasSize() {
		const backdrop = element('backdrop');
		const backdropWrapper = element('backdrop-wrapper');

		backdrop.style.width = `${settings.canvasWidth}px`;
		backdrop.style.height = `${settings.canvasHeight}px`;

		backdropWrapper.style.width = `${settings.canvasWidth + (settings.offset * 2)}px`;
		backdropWrapper.style.height = `${settings.canvasHeight + (settings.offset * 2)}px`;
	}
	function mountComponents() {

		const backdrop = element('backdrop');
		const componentWrapper = element('hot-spot-canvas');
		backdrop.setAttribute('data-readOnly', settings.isReadonly.toString());
		componentWrapper.setAttribute('data-readOnly', settings.isReadonly.toString());

		backdropSelector.connect(currentValue.imageUrl, element("image-controls"), handleBackdropChange);
		hotSpotEditor.connect(
			element('hot-spot-controls'), element('hot-spot-display'), element('insert-controls'), currentValue.hotSpots, settings,
			handleHotSpotChange
		);
	}

	function unmountComponents() {
		backdropSelector.disconnect();
		hotSpotEditor.disconnect();

		element("image-controls").innerHTML = '';
		element("hot-spot-controls").innerHTML = '';
	}

	function setImageLoading() {

		element('backdrop-wrapper').setAttribute('data-loading', 'true');
		element("backdrop").style.backgroundImage = ``;
	}

	async function setImage() {

		setImageLoading()

		if (!currentValue?.imageUrl) {
			element('backdrop-wrapper').setAttribute('data-loading', 'false');
			log.debug('clearing hero image');
			return;
		}
		const contentItem = await contentLoader()
			.get<MediaItem>(currentValue.imageUrl);

		if (!contentItem) {
			element('backdrop-wrapper').setAttribute('data-loading', 'false');
			return;
		}

		log.debug('setting hero image', contentItem.publicUrl, `width: ${settings.canvasWidth}`, `height: ${settings.canvasHeight}`);

		element("backdrop").style.backgroundImage = `url(${contentItem.publicUrl}?w=${settings.canvasWidth}&h=${settings.canvasHeight}&mode=crop)`;
		element('backdrop-wrapper').setAttribute('data-loading', 'false');
	}

	async function handleBackdropChange(value: string) {
		if (value === currentValue.imageUrl) return;

		log.debug('backdrop update', settings.propertyName, value)

		setImageLoading();
		currentValue.imageUrl = value ?? undefined;

		await updateValue({
			canvasWidth: settings.canvasWidth,
			canvasHeight: settings.canvasHeight,
			hotSpots: currentValue.hotSpots,
			imageUrl: currentValue.imageUrl
		});
		await setImage();
	};

	async function handleHotSpotChange(value: Array<HotSpotModel>) {
		if (valueEquals(value, currentValue.hotSpots)) return;

		log.debug('hotSpot update', value)

		currentValue.hotSpots = value;
		hotSpotEditor.setValue(value);

		await updateValue({
			canvasWidth: settings.canvasWidth,
			canvasHeight: settings.canvasHeight,
			imageUrl: currentValue.imageUrl,
			hotSpots: deepClone(value)
		})
	};

	return {
		onStartup: async (initialValue) => {
			log.debug('onStartup', initialValue);
			log.debug('settings', settings);

			currentValue = initialValue ?? initializeHotSpotCanvas(settings);

			if (currentValue.hotSpots.length < settings.maxHotSpots)
				currentValue.hotSpots =  [ ...currentValue.hotSpots, ...createEmptyHotSpotArray(settings).slice(currentValue.hotSpots.length) ];
			if (currentValue.hotSpots.length > settings.maxHotSpots)
				currentValue.hotSpots = currentValue.hotSpots.slice(0, settings.maxHotSpots);

			setCanvasSize();
			mountComponents();

			await setImage();
		},
		onTeardown: () => {
			log.debug('onTeardown');

			unmountComponents();
		}
	}
});