/// <reference path="../../env.d.ts" />
/// <reference path="../../node_modules/@types/dojo/dijit.d.ts" />

// Dojo components --------------------------------------------------------------
import Button from 'dijit/form/Button';
import on from 'dojo/on';
import lang from 'dojo/_base/lang';

// UI Extension Framework --------------------------------------------------------
import { valueEquals } from 'epi-ui-extensions';

// Optimizely components --------------------------------------------------------
import ContentSelector from 'epi-cms/widget/ContentSelector';

// Internal components ----------------------------------------------------------
import 'xstyle/css!./hotSpotContentSelector.css';

import { mapAllowedReferences } from '../util/epi';
import { log } from '../logger';
import { HotSpotEditorSettings } from '../data/EditorSettings';

export type HotSpotContentSelector = ReturnType<typeof createHotSpotContentSelector>;

export function createHotSpotContentSelector(
	settings: HotSpotEditorSettings, initialValue: string | undefined, placeAt: HTMLElement,
	onChange: (contentReference: string | undefined) => Promise<void>
) {

	let currentValue = initialValue;

	const contentSelectorWrapper = document.createElement('div');
	contentSelectorWrapper.className = 'hot-spot-content-selector';
	contentSelectorWrapper.setAttribute('data-type', getDataType(initialValue));

	const displayContentSelector = new ContentSelector({
		title: "Select content item",
		class: "display-content-selector",
		required: true,
		readOnly: settings.isReadonly,
		searchArea: [settings.contentRepositoryDescriptors["pages"].searchArea, settings.contentRepositoryDescriptors["catalog"].searchArea].join(','),
		roots: settings.contentRepositoryDescriptors["pages"].roots,
		allowedTypes: [...settings.supportedPageTypes, ...settings.supportedCatalogTypes],
		repositoryKey: 'media',
		value: currentValue,
		allowedDndTypes: mapAllowedReferences(settings),
	});
	displayContentSelector.placeAt(contentSelectorWrapper);
	function onContentChanged() {
		console.log('onContentChanged', arguments)
		if (!displayContentSelector.value) return;
		if (displayContentSelector.value === currentValue) return;

		currentValue = displayContentSelector.value;
		contentSelectorWrapper.setAttribute('data-type', getDataType(currentValue));

		onChange(currentValue).catch(ex => log.error(ex));
	}
	const onChangeHandler = on(displayContentSelector, 'change', lang.hitch(displayContentSelector, onContentChanged), true);

	const pageContentSelector = new ContentSelector({
		title: "Select page",
		className: "page-content-selector",
		required: false,
		readOnly: settings.isReadonly || settings.supportedPageTypes.length === 0,
		showSearchBox: true,
		searchArea: settings.contentRepositoryDescriptors["pages"].searchArea,
		roots: settings.contentRepositoryDescriptors["pages"].roots,
		allowedTypes: settings.supportedPageTypes,
		repositoryKey: 'pages',
		allowedDndTypes: []
	});
	pageContentSelector._onDialogHide = () => {

		if (!pageContentSelector.value) return;
		if (pageContentSelector.value === currentValue) return;

		currentValue = pageContentSelector.value;

		displayContentSelector._setValueAndFireOnChange(currentValue);
		catalogContentSelector._setValueAndFireOnChange(null);
		contentSelectorWrapper.setAttribute('data-type', getDataType(currentValue));
		onChange(currentValue).catch(ex => log.error(ex));
	};
	const pageButton = new Button({
		title: "Browse pages",
		label: "Browse pages",
		class: "page-button",
		showLabel: false,
		readOnly: settings.isReadonly || settings.supportedPageTypes.length === 0,
		iconClass:'dijitIcon dijitMenuItemIcon epi-iconObjectPage',
		onClick: () => {
			if (settings.isReadonly || settings.supportedPageTypes.length === 0) return;
			pageContentSelector.button.onClick();
		}
	});
	pageButton.placeAt(contentSelectorWrapper);

	const catalogContentSelector = new ContentSelector({
		title: "Select catalog item",
		className: "catalog-content-selector",
		required: false,
		readOnly: settings.isReadonly || settings.supportedCatalogTypes.length === 0,
		showSearchBox: true,
		searchArea: settings.contentRepositoryDescriptors["catalog"].searchArea,
		roots: settings.contentRepositoryDescriptors["catalog"].roots,
		allowedTypes: settings.supportedCatalogTypes,
		repositoryKey: 'catalog',
		allowedDndTypes: []
	});
	catalogContentSelector._onDialogHide = () => {

		if (!catalogContentSelector.value) return;
		if (catalogContentSelector.value === currentValue) return;

		currentValue = catalogContentSelector.value;

		displayContentSelector._setValueAndFireOnChange(currentValue);
		pageContentSelector._setValueAndFireOnChange(null);
		contentSelectorWrapper.setAttribute('data-type', getDataType(currentValue));
		onChange(currentValue).catch(ex => log.error(ex));
	};
	const catalogButton = new Button({
		title: "Browse catalog",
		label: "Browse catalog",
		class: "catalog-button",
		showLabel: false,
		readOnly: settings.isReadonly || settings.supportedCatalogTypes.length === 0,
		iconClass:'dijitIcon dijitMenuItemIcon epi-iconObjectCatalog',
		onClick: () => {
			if (settings.isReadonly || settings.supportedCatalogTypes.length === 0) return;
			catalogContentSelector.button.onClick();
		}
	});
	catalogButton.placeAt(contentSelectorWrapper);

	placeAt.append(contentSelectorWrapper);

	function disconnect() {
		onChangeHandler.remove();

		contentSelectorWrapper.remove();
		displayContentSelector.destroy();
		pageButton.destroy();
		pageContentSelector.destroy();
		catalogButton.destroy();
		catalogContentSelector.destroy();
	}

	async function setValue(value: string | undefined) {
		if (valueEquals(value, currentValue)) return;

		currentValue = value;

		displayContentSelector._setValueAndFireOnChange(currentValue);
		pageContentSelector._setValueAndFireOnChange(currentValue);
		catalogContentSelector._setValueAndFireOnChange(currentValue);
		contentSelectorWrapper.setAttribute('data-type', getDataType(currentValue));
	}

	function getDataType(reference: string | undefined) {
		if (!reference) return 'undefined';
		if (reference.endsWith('__CatalogContent')) return 'catalogContent';
		return 'pageData';
	}

	return {
		setValue,
		disconnect
	}
}