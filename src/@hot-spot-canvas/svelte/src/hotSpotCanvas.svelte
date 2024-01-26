<script context="module" lang="ts">
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
    canvasResizeMode: CanvasResizeMode;
    model: HotSpotCanvasViewModel<T>;
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";

  export let model: HotSpotCanvasProps["model"];
  export let canvasAltText: HotSpotCanvasProps["canvasAltText"] =
    "A canvas containing hot-spots referencing pages and products";
  export let canvasWidth: HotSpotCanvasProps["canvasWidth"];
  export let canvasHeight: HotSpotCanvasProps["canvasHeight"];
  export let siteHost: HotSpotCanvasProps["siteHost"];

  function mitosis_styling(node, vars) {
    Object.entries(vars || {}).forEach(([p, v]) => {
      if (p.startsWith("--")) {
        node.style.setProperty(p, v);
      } else {
        node.style[p] = v;
      }
    });
  }

  let canvasMetaData = {
    width: model.canvasDimensions.defaultWidth,
    height: model.canvasDimensions.defaultHeight,
    url: undefined,
  };

  onMount(() => {
    const calculateWidth = () => {
      if (canvasWidth) return canvasWidth;
      if (canvasHeight)
        return canvasHeight / model.canvasDimensions.aspectRatio;
      return model.canvasDimensions.defaultWidth;
    };
    const calculateHeight = () => {
      if (canvasHeight) return canvasHeight;
      if (canvasWidth) return canvasWidth * model.canvasDimensions.aspectRatio;
      return model.canvasDimensions.defaultHeight;
    };
    const width = calculateWidth();
    const height = calculateHeight();
    const createImageUrl = () => {
      if (!model) return null;
      const imageUrl = new URL(model.imageUrl, siteHost);
      imageUrl.searchParams.append("w", width.toString());
      imageUrl.searchParams.append("h", height.toString());
      imageUrl.searchParams.append("mode", "crop");
      return imageUrl.toString();
    };
    canvasMetaData = {
      width,
      height,
      url: createImageUrl(),
    };
  });
</script>

{#if !!model}
  <div
    use:mitosis_styling={{
      margin: "10px",
      display: "flex",
      position: "relative",
      overflow: "visible",
      width: `${canvasMetaData.width}px`,
      height: `${canvasMetaData.height}px`,
    }}
    class="hot-spot-canvas"
  >
    <img
      src={canvasMetaData.url}
      width={canvasMetaData.width}
      height={canvasMetaData.height}
      alt={canvasAltText}
    />

    <ul
      use:mitosis_styling={{
        display: "inline-flex",
        listStyle: "none",
        margin: "0",
        padding: "0",
        overflow: "visible",
      }}
    >
      {#each model.hotSpots as hotSpot}
        <li
          use:mitosis_styling={{
            display: "flex",
            listStyle: "none",
            margin: "0",
            padding: "0",
            overflow: "visible",
            position: "absolute",
            textDecoration: "none",
            left: `${hotSpot.coordinates.x}%`,
            top: `${hotSpot.coordinates.y}%`,
          }}
          class="hot-spot-canvas-hot-spot"
        >
          {#if hotSpot.content.contentType.includes("Page")}
            <slot name="page" />
          {/if}

          {#if hotSpot.content.contentType.includes("Product")}
            <slot name="product" />
          {/if}

          {#if hotSpot.content.contentType.includes("Variation")}
            <slot name="variant" />
          {/if}
        </li>
      {/each}
    </ul>
  </div>
{/if}