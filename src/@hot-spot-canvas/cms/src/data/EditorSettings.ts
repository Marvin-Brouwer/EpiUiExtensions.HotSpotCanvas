/// <reference path="../../env.d.ts" />

import dependency from 'epi/dependency';
import type { ContentRepositoryDescriptors } from 'epi/dependency/_types';

import { generateSeededColor } from '../util/seededColors';

type HotSpotEditorConfiguration = {

	offset: number,
	canvasWidth: number,
	canvasHeight: number,

	maxHotSpots: number,
	hotSpotColors: Array<string>

	supportedPageTypes: Array<string>,
	supportedCatalogTypes: Array<string>

	propertyName: string
}

export type HotSpotEditorSettings = HotSpotEditorConfiguration & {
	contentRepositoryDescriptors: ContentRepositoryDescriptors,
	isReadonly: boolean
}

export function createEditorSettings(propertyName: string, isReadonly: boolean, getConfig: <T>() => T): HotSpotEditorSettings {

	const config = getConfig<HotSpotEditorConfiguration>();

	const contentRepositoryDescriptors = dependency.resolve("epi.cms.contentRepositoryDescriptors");
	const hotSpotColors = new Array(config.maxHotSpots).fill(0).map((_, i) => generateSeededColor(i));

	return {
		contentRepositoryDescriptors,
		...config,
		hotSpotColors,
		isReadonly,
		propertyName
	}
}