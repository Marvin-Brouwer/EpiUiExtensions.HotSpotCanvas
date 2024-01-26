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
    imageWidth: model.canvasDimensions.defaultWidth,
    imageHeight: model.canvasDimensions.defaultHeight,
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
    if (height > width) {
      canvasMetaData = {
        ...canvasMetaData,
        imageWidth: null,
      };
    } else {
      canvasMetaData = {
        ...canvasMetaData,
        imageHeight: null,
      };
    }
    const createImageUrl = () => {
      if (!model) return null;
      const imageUrl = new URL(model.imageUrl, siteHost);
      if (canvasMetaData.imageWidth) {
        imageUrl.searchParams.append("w", canvasMetaData.imageWidth.toString());
      }
      if (canvasMetaData.imageHeight) {
        imageUrl.searchParams.append(
          "h",
          canvasMetaData.imageHeight.toString()
        );
      }
      return imageUrl.toString();
    };
    canvasMetaData = {
      ...canvasMetaData,
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
    <div
      use:mitosis_styling={{
        margin: "0",
        padding: "0",
        position: "relative",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <img
        use:mitosis_styling={{
          margin: "0",
          padding: "0",
          position: "absolute",
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
        src={canvasMetaData.url}
        width={canvasMetaData.imageWidth}
        height={canvasMetaData.imageHeight}
        alt={canvasAltText}
      />
    </div>

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