import { For, Show, Slot } from '@builder.io/mitosis';

export type HotSpotViewModel<T = any> = {

	contentUrl: string,
	coordinates: { x: number, y: number },
	content: T
}

export type HotSpotCanvasViewModel<T = any> = {

	canvasWidth: number,
	canvasHeight: number,

	imageUrl: string,
	hotSpots: Array<HotSpotViewModel<T>>
}

export type HotSpotCanvasProps<T = any> = {
  siteHost: string,
  model: HotSpotCanvasViewModel<T>,
};

export default function HotSpotCanvas(props: HotSpotCanvasProps) {

  function createImageUrl(props: HotSpotCanvasProps) {
    
    const imageUrl = new URL(props.model.imageUrl, props.siteHost)
    imageUrl.searchParams.append('w', props.model.canvasWidth.toString());
    imageUrl.searchParams.append('h', props.model.canvasHeight.toString());
    imageUrl.searchParams.append('mode', 'crop');
  
    return imageUrl.toString();
  }

  console.log('hotSpot', props.model.hotSpots)
  return (
    <div class="hot-spot-canvas" style={{ width: `${props.model.canvasWidth}px`, height: `${props.model.canvasHeight}px` }}>
		<img src={createImageUrl(props)} width={props.model.canvasWidth} height={props.model.canvasHeight} />

		<ul>
      <For each={props.model.hotSpots} >
      {
        (hotSpot) => (
          <li style={{ left: `${hotSpot.coordinates.x}px`, top: `${hotSpot.coordinates.y}px`}} class="hot-spot-canvas-hot-spot">
            <Show when={hotSpot.content.contentType.includes('Page')}>
              <>
                <Slot name="page" hotSpot={hotSpot} />
              </>
            </Show>
            <Show when={hotSpot.content.contentType.includes('Product')}>
              <>
                <Slot name="product" hotSpot={hotSpot}/>
              </>
            </Show>
            <Show when={hotSpot.content.contentType.includes('Variation')}>
              <>
                <Slot name="variant" hotSpot={hotSpot}/>
              </>
            </Show>
          </li>
        )
      }
      </For>
    </ul>
  </div>
  );
}

export function getContentUrl (siteHost: string, hotSpot: HotSpotViewModel) {
	return pathJoin([siteHost, hotSpot.contentUrl]);
};

export function pathJoin(parts: Array<string>, separator: string = '/') {

	var replace = new RegExp(separator+'{1,}', 'g');
	return ('/' + parts.join(separator)).replace(replace, separator);
};

export function urlJoin(origin: string, parts: Array<string>) {

	const path = pathJoin(parts);
	const url = new URL(origin);
	url.pathname = path;

	return url;
};