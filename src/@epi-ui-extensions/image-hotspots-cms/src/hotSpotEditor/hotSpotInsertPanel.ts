import './hotSpotInsertPanel.css';

import ContentSelector from 'epi-cms/widget/ContentSelector';
import Button from 'dijit/form/Button';
import { HotSpotEditorModel } from './hotSpotEditorModel';

export type HotSpotInsertPanel = ReturnType<typeof createHotSpotInsertPanel>;

export function createHotSpotInsertPanel(
	insertContainer: HTMLDivElement,
	editorState: HotSpotEditorModel
) {

	const { settings } = editorState;

	const allowAdditions = () => editorState.getHotSpots().filter(hotSpot => !!hotSpot).length < settings.maxHotSpots;

	const pageContentSelector = new ContentSelector({
		title: "Select page",
		className: "page-content-selector",
		required: false,
		readOnly: settings.isReadonly || settings.supportedPageTypes.length === 0,
		showSearchBox: true,
		dndSourcePropertyName: "contentLink",
		searchArea: settings.contentRepositoryDescriptors["pages"].searchArea,
		roots: settings.contentRepositoryDescriptors["pages"].roots,
		allowedTypes: settings.supportedPageTypes,
		repositoryKey: 'pages',
		allowedDndTypes: []
	});
	pageContentSelector._onDialogHide = async () => {

		if (!allowAdditions() || settings.supportedPageTypes.length === 0) return;
		if (!pageContentSelector.value) return;

		await editorState.addHotSpot(
			pageContentSelector.value
		);

		pageContentSelector._setValueAndFireOnChange(null);
	};
	const pageButton = new Button({
		title: "Add page",
		label: "Add page",
		class: "page-button",
		showLabel: true,
		readOnly: settings.isReadonly,
		disabled: !allowAdditions() || settings.supportedPageTypes.length === 0,
		iconClass:'dijitIcon dijitMenuItemIcon epi-iconObjectPage',
		onClick: () => {

			if (settings.isReadonly || !allowAdditions() || settings.supportedPageTypes.length === 0) return;
			pageContentSelector.button.onClick();
		}
	});
	pageButton.placeAt(insertContainer);

	const catalogContentSelector = new ContentSelector({
		title: "Select catalog item",
		className: "catalog-content-selector",
		required: false,
		readOnly: settings.isReadonly || settings.supportedCatalogTypes.length === 0,
		showSearchBox: true,
		dndSourcePropertyName: "contentLink",
		searchArea: settings.contentRepositoryDescriptors["catalog"].searchArea,
		roots: settings.contentRepositoryDescriptors["catalog"].roots,
		allowedTypes: settings.supportedCatalogTypes,
		repositoryKey: 'catalog',
		allowedDndTypes: []
	});
	catalogContentSelector._onDialogHide = async () => {

		if (settings.isReadonly || !allowAdditions() || settings.supportedCatalogTypes.length === 0) return;
		if (!catalogContentSelector.value) return;

		await editorState.addHotSpot(
			catalogContentSelector.value
		);

		catalogContentSelector._setValueAndFireOnChange(null);
	};
	const catalogButton = new Button({
		title: "Add catalog item",
		label: "Add catalog item",
		class: "catalog-button",
		showLabel: true,
		readOnly: settings.isReadonly,
		disabled: !allowAdditions() || settings.supportedCatalogTypes.length === 0,
		iconClass:'dijitIcon dijitMenuItemIcon epi-iconObjectCatalog',
		onClick: () => {

			if (settings.isReadonly || !allowAdditions() || settings.supportedCatalogTypes.length === 0) return;
			catalogContentSelector.button.onClick();
		}
	});
	catalogButton.placeAt(insertContainer);

	function disconnect() {

		pageContentSelector.destroy();
		pageButton.destroy();
		catalogContentSelector.destroy();
		catalogButton.destroy();
	}

	async function onChange() {

		pageButton.setDisabled(!allowAdditions());
		catalogButton.setDisabled(!allowAdditions());
	}

	return {
		onChange,
		disconnect
	}
}