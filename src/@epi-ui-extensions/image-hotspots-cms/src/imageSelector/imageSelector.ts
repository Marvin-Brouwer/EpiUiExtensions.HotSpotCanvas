/// <reference path="../../env.d.ts" />
/// <reference path="../../node_modules/@types/dojo/dijit.d.ts" />

// Dojo components --------------------------------------------------------------
import on from 'dojo/on';
import _Widget from 'dijit/_Widget';
import lang from 'dojo/_base/lang';
import registry from 'dijit/registry';

// Optimizely components --------------------------------------------------------
import ThumbnailSelector from 'epi-cms/widget/ThumbnailSelector';
import { HotSpotEditorSettings } from '../data/EditorSettings';

/**
 * A wrapper around EPiServer's @see ThumbnailSelector, to make it slightly simpler to use
 */
export type ImageSelector = ReturnType<typeof createImageSelector>;

/**
 * This creates a wrapper around EPiServer's @see ThumbnailSelector, to make it slightly simpler to use
 * and to hide away the scaffolding
 */
export function createImageSelector(name: string, settings: HotSpotEditorSettings) {

	let imageSelectorHandle: ReturnType<typeof on> | undefined;
	let imageSelector: typeof ThumbnailSelector | undefined;

	function connect (initialValue: string | undefined, placeAt: HTMLElement, onChange: ((value: string) => Promise<void>)) {
		if (imageSelector) disconnect();

		imageSelector = new ThumbnailSelector({
			title: name,
			label: `${name}_${settings.propertyName}`,
			name: `${name}_${settings.propertyName}`,
			readOnly: settings.isReadonly,
			repositoryKey: 'media',
			value: initialValue,
			containedTypes: ["episerver.core.contentfolder", "episerver.core.icontentmedia"],
			typeIdentifiers: ['episerver.core.icontentimage'],
			allowedTypes: ['episerver.core.icontentimage'],
			allowedDndTypes: ['episerver.core.icontentimage.reference'],
			allowedExtensions: [ "jpg", "jpeg", "png", "svg" ]
		});


		imageSelector!.placeAt(placeAt);

		if (!settings.isReadonly) {
			const onChangeRelay = async () => {
				await onChange(imageSelector.value);
			}
			imageSelectorHandle = on(imageSelector!, 'change', lang.hitch(imageSelector, onChangeRelay), true);
		}
	}
	function disconnect () {
		if (!imageSelector) return;

		if (imageSelectorHandle){
			imageSelectorHandle.remove();
			imageSelectorHandle = undefined;
		}

		// .remove() didn't work
		imageSelector.parentElement.removeChild(imageSelector);
		imageSelector.destroy(false);
		registry.remove(imageSelector.id);
		imageSelector = undefined;
	}

	return {
		connect,
		disconnect
	}
}