import { HotSpotEditorSettings } from "../data/EditorSettings";
import { HotSpotModel } from "../data/HotSpotModel";

/**
 * Creates an empty array with values of `undefined` with a length of `maxHotspots`
 */
export const createEmptyHotSpotArray = (settings: HotSpotEditorSettings): Array<HotSpotModel | undefined> => new Array(settings.maxHotSpots)
	.fill(0)
	.map(_ => undefined);