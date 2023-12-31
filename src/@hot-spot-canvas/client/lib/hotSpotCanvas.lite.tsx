import { For, Show } from '@builder.io/mitosis';

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
  hero: HotSpotCanvasViewModel<T>,
  pageWrapper: (hotSpot: HotSpotViewModel<T>) => Element,
  productWrapper: (hotSpot: HotSpotViewModel<T>) => Element,
  variantWrapper: (hotSpot: HotSpotViewModel<T>) => Element,
};

export default function HotSpotCanvas(props: HotSpotCanvasProps) {

  function createImageUrl(props: HotSpotCanvasProps) {
    
    const imageUrl = new URL(props.hero.imageUrl, props.siteHost)
    imageUrl.searchParams.append('w', props.hero.canvasWidth.toString());
    imageUrl.searchParams.append('h', props.hero.canvasHeight.toString());
    imageUrl.searchParams.append('mode', 'crop');
  
    return imageUrl.toString();
  }

  return (
    <div class="hot-spot-canvas" style={{ width: `${props.hero.canvasWidth}px`, height: `${props.hero.canvasHeight}px` }}>
		<img src={createImageUrl(props)} width={props.hero.canvasWidth} height={props.hero.canvasHeight} />

		<ul>
      <For each={props.hero.hotSpots}>
      {
        (hotSpot) => (
          <>
            <li style={{ left: `${hotSpot.coordinates.x}px`, top: `${hotSpot.coordinates.y}px`}} class="hot-spot-canvas-hot-spot">
              <Show when={hotSpot.content.contentType.includes('Page')}>{props.pageWrapper(hotSpot)}</Show>
              <Show when={hotSpot.content.contentType.includes('Product')}>{props.productWrapper(hotSpot)}</Show>
              <Show when={hotSpot.content.contentType.includes('Variation')}>{props.variantWrapper(hotSpot)}</Show>
            </li>
          </>
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