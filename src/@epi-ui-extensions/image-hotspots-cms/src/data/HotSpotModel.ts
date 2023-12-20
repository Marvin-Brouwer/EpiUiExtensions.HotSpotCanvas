import { HotSpotEditorSettings } from "../editor/EditorSettings"
import { createEmptyHotSpotArray } from "../util/arrays"

export type HotSpotModel = {
	coordinates: { x: number, y: number },
	contentReference: string | undefined
}
export type HotSpotCanvasModel = {
	canvasWidth: number,
	canvasHeight: number,
	imageUrl: string | undefined,
	hotSpots: Array<HotSpotModel | undefined>
}

export const initializeHotSpotCanvas = (settings: HotSpotEditorSettings): HotSpotCanvasModel => ({

	canvasWidth: settings.canvasWidth,
	canvasHeight: settings.canvasHeight,
	imageUrl: undefined,
	hotSpots: createEmptyHotSpotArray(settings)
})