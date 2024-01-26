import { Show, For, onMount, createSignal } from "solid-js";

export type Coordinate = {
  x: number;
  y: number;
};
export type HotSpotViewModel<T = any> = {
  contentUrl: string;
  coordinates: Coordinate;
  content: T;
};
export type HotSpotCanvasViewModel<T = any> = {
  canvasDimensions: {
    defaultWidth: number;
    defaultHeight: number;
    aspectRatio: number;
  };
  imageUrl: string;
  hotSpots: Array<HotSpotViewModel<T>>;
};
export type HotSpotCanvasProps<T = any> = {
  siteHost: string;
  canvasWidth?: number;
  canvasHeight?: number;
  canvasAltText?: string;
  model: HotSpotCanvasViewModel<T>;
};

function HotSpotCanvas(props: HotSpotCanvasProps) {
  const [canvasMetaData, setCanvasMetaData] = createSignal({
    width: props.model.canvasDimensions.defaultWidth,
    height: props.model.canvasDimensions.defaultHeight,
    imageWidth: props.model.canvasDimensions.defaultWidth,
    imageHeight: props.model.canvasDimensions.defaultHeight,
    url: undefined,
  });

  onMount(() => {
    const calculateWidth = () => {
      if (props.canvasWidth) return props.canvasWidth;
      if (props.canvasHeight)
        return props.canvasHeight / props.model.canvasDimensions.aspectRatio;
      return props.model.canvasDimensions.defaultWidth;
    };
    const calculateHeight = () => {
      if (props.canvasHeight) return props.canvasHeight;
      if (props.canvasWidth)
        return props.canvasWidth * props.model.canvasDimensions.aspectRatio;
      return props.model.canvasDimensions.defaultHeight;
    };
    const width = calculateWidth();
    const height = calculateHeight();
    if (height > width) {
      setCanvasMetaData({
        ...canvasMetaData(),
        imageWidth: null,
      });
    } else {
      setCanvasMetaData({
        ...canvasMetaData(),
        imageHeight: null,
      });
    }
    const createImageUrl = () => {
      if (!props?.model) return null;
      const imageUrl = new URL(props.model.imageUrl, props.siteHost);
      if (canvasMetaData().imageWidth) {
        imageUrl.searchParams.append(
          "w",
          canvasMetaData().imageWidth.toString()
        );
      }
      if (canvasMetaData().imageHeight) {
        imageUrl.searchParams.append(
          "h",
          canvasMetaData().imageHeight.toString()
        );
      }
      return imageUrl.toString();
    };
    setCanvasMetaData({
      ...canvasMetaData(),
      width,
      height,
      url: createImageUrl(),
    });
  });

  return (
    <Show when={!!props?.model}>
      <div
        class="hot-spot-canvas"
        style={{
          margin: "10px",
          display: "flex",
          position: "relative",
          overflow: "visible",
          width: `${canvasMetaData().width}px`,
          height: `${canvasMetaData().height}px`,
        }}
      >
        <div
          style={{
            margin: "0",
            padding: "0",
            position: "relative",
            display: "flex",
            overflow: "hidden",
          }}
        >
          <img
            src={canvasMetaData().url}
            width={canvasMetaData().imageWidth}
            height={canvasMetaData().imageHeight}
            alt={props.canvasAltText}
            style={{
              margin: "0",
              padding: "0",
              position: "absolute",
              display: "flex",
              "align-content": "center",
              "justify-content": "center",
              "align-items": "center",
            }}
          />
        </div>
        <ul
          style={{
            display: "inline-flex",
            "list-style": "none",
            margin: "0",
            padding: "0",
            overflow: "visible",
          }}
        >
          <For each={props.model.hotSpots}>
            {(hotSpot, _index) => {
              const index = _index();
              return (
                <li
                  class="hot-spot-canvas-hot-spot"
                  style={{
                    display: "flex",
                    "list-style": "none",
                    margin: "0",
                    padding: "0",
                    overflow: "visible",
                    position: "absolute",
                    "text-decoration": "none",
                    left: `${hotSpot.coordinates.x}%`,
                    top: `${hotSpot.coordinates.y}%`,
                  }}
                >
                  <Show when={hotSpot.content.contentType.includes("Page")}>
                    <>
                      <Slot name="page" hotSpot={hotSpot}></Slot>
                    </>
                  </Show>
                  <Show when={hotSpot.content.contentType.includes("Product")}>
                    <>
                      <Slot name="product" hotSpot={hotSpot}></Slot>
                    </>
                  </Show>
                  <Show
                    when={hotSpot.content.contentType.includes("Variation")}
                  >
                    <>
                      <Slot name="variant" hotSpot={hotSpot}></Slot>
                    </>
                  </Show>
                </li>
              );
            }}
          </For>
        </ul>
      </div>
    </Show>
  );
}

export default HotSpotCanvas;
