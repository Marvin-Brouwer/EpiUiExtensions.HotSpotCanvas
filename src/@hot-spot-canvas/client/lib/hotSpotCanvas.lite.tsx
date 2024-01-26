import { For, Show, Slot, useState, onMount, useDefaultProps } from '@builder.io/mitosis';

export type Coordinate = { x: number, y: number };
export type HotSpotViewModel<T = any> = {

	contentUrl: string,
	coordinates: Coordinate,
	content: T
}

export type HotSpotCanvasViewModel<T = any> = {

	canvasDimensions: {
    defaultWidth: number,
    defaultHeight: number,
    aspectRatio: number,
  }

	imageUrl: string,
	hotSpots: Array<HotSpotViewModel<T>>
}

export type HotSpotCanvasProps<T = any> = {
  siteHost: string,
  canvasWidth?: number, 
  canvasHeight?: number, 
  canvasAltText?: string,
  canvasResizeMode: CanvasResizeMode,
  model: HotSpotCanvasViewModel<T>,
};


export default function HotSpotCanvas(props: HotSpotCanvasProps) {

  useDefaultProps({
    canvasAltText: "A canvas containing hot-spots referencing pages and products"
  });

  const [canvasMetaData, setCanvasMetaData] = useState({
    width: props.model.canvasDimensions.defaultWidth,
    height: props.model.canvasDimensions.defaultHeight,
    url: undefined,
  })

  onMount(() => {

    const calculateWidth = () => {
      
      if (props.canvasWidth) return props.canvasWidth;
  
      if (props.canvasHeight)
        return props.canvasHeight / props.model.canvasDimensions.aspectRatio
      
      return props.model.canvasDimensions.defaultWidth
    }
    
    const calculateHeight = () => {
  
      if (props.canvasHeight) return props.canvasHeight;
  
      if (props.canvasWidth)
        return props.canvasWidth * props.model.canvasDimensions.aspectRatio
  
      return props.model.canvasDimensions.defaultHeight
    }
    const width = calculateWidth()
    const height = calculateHeight()
  
    const createImageUrl = () => {
  
      if (!props?.model) return null;
      
      const imageUrl = new URL(props.model.imageUrl, props.siteHost)
      imageUrl.searchParams.append('w', width.toString());
      imageUrl.searchParams.append('h', height.toString());
      imageUrl.searchParams.append('mode', 'crop');
    
      return imageUrl.toString();
    }

    setCanvasMetaData({
      width,
      height,
      url: createImageUrl()
    })
  })

  return (
    <Show when={!!props?.model}>
      <div 
        class="hot-spot-canvas" 
        style={{
          margin: "10px",
          display: "flex",
          position: "relative",
          overflow: "visible",
          width: `${canvasMetaData.width}px`,
          height: `${canvasMetaData.height}px`,
        }}
      >
      <img 
        src={canvasMetaData.url} 
        width={canvasMetaData.width} 
        height={canvasMetaData.height} 
        alt={props.canvasAltText} 
      />

      <ul
        style={{
          display: 'inline-flex',
          listStyle: 'none',
          margin: '0',
          padding: '0',
          overflow: 'visible',
        }}
      >
        <For each={props.model.hotSpots} >
        {
          (hotSpot) => (
            <li 
            class="hot-spot-canvas-hot-spot"
            style={{
              display: 'flex',
              listStyle: 'none',
              margin: '0',
              padding: '0',
              overflow: 'visible',
              position: 'absolute',
              textDecoration: 'none',
              left: `${hotSpot.coordinates.x}%`, 
              top: `${hotSpot.coordinates.y}%`
            }}
          >
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
  </Show>
  );
}