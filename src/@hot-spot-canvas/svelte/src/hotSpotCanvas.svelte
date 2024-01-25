<script context="module" lang="ts">
  export type HotSpotViewModel<T = any> = {
    contentUrl: string;
    coordinates: {
      x: number;
      y: number;
    };
    content: T;
  };

  export type HotSpotCanvasViewModel<T = any> = {
    canvasWidth: number;
    canvasHeight: number;
    imageUrl: string;
    hotSpots: Array<HotSpotViewModel<T>>;
  };

  export type HotSpotCanvasProps<T = any> = {
    siteHost: string;
    model: HotSpotCanvasViewModel<T>;
  };
</script>

<script lang="ts">
  export function getContentUrl(siteHost: string, hotSpot: HotSpotViewModel) {
    return pathJoin([siteHost, hotSpot.contentUrl]);
  }
  export function pathJoin(parts: Array<string>, separator: string = "/") {
    var replace = new RegExp(separator + "{1,}", "g");
    return ("/" + parts.join(separator)).replace(replace, separator);
  }
  export function urlJoin(origin: string, parts: Array<string>) {
    const path = pathJoin(parts);
    const url = new URL(origin);
    url.pathname = path;
    return url;
  }

  export let model: HotSpotCanvasProps["model"];
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

  function createImageUrl(props: HotSpotCanvasProps) {
    if (!model) return null;
    const imageUrl = new URL(model.imageUrl, siteHost);
    imageUrl.searchParams.append("w", canvasWidth(props).toString());
    imageUrl.searchParams.append("h", canvasHeight(props).toString());
    imageUrl.searchParams.append("mode", "crop");
    return imageUrl.toString();
  }
  function canvasWidth(props: HotSpotCanvasProps) {
    return model?.canvasWidth ?? 0;
  }
  function canvasHeight(props: HotSpotCanvasProps) {
    return model?.canvasHeight ?? 0;
  }
</script>

{#if !!model}
  <div
    use:mitosis_styling={{
      margin: "10px",
      display: "flex",
      position: "relative",
      overflow: "visible",
      width: `${canvasWidth(props)}px`,
      height: `${canvasHeight(props)}px`,
    }}
    class="hot-spot-canvas"
  >
    <img
      src={createImageUrl(props)}
      width={canvasWidth(props)}
      height={canvasHeight(props)}
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
            left: `${hotSpot.coordinates.x}px`,
            top: `${hotSpot.coordinates.y}px`,
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