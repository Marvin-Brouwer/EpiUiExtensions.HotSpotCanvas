import { HotSpotViewModel } from "./hotSpotViewModel";

export type HotSpotCanvasViewModel = {

	canvasWidth: number,
	canvasHeight: number,

	imageUrl: string,
	hotSpots: Array<HotSpotViewModel>
}