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
    hero: HotSpotCanvasViewModel<T>;
    pageWrapper: (hotSpot: HotSpotViewModel<T>) => Element;
    productWrapper: (hotSpot: HotSpotViewModel<T>) => Element;
    variantWrapper: (hotSpot: HotSpotViewModel<T>) => Element;
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

  export let hero: HotSpotCanvasProps["hero"];
  export let siteHost: HotSpotCanvasProps["siteHost"];
  export let pageWrapper: HotSpotCanvasProps["pageWrapper"];
  export let productWrapper: HotSpotCanvasProps["productWrapper"];
  export let variantWrapper: HotSpotCanvasProps["variantWrapper"];

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
    const imageUrl = new URL(hero.imageUrl, siteHost);
    imageUrl.searchParams.append("w", hero.canvasWidth.toString());
    imageUrl.searchParams.append("h", hero.canvasHeight.toString());
    imageUrl.searchParams.append("mode", "crop");
    return imageUrl.toString();
  }
</script>

<div
  use:mitosis_styling={{
    width: `${hero.canvasWidth}px`,
    height: `${hero.canvasHeight}px`,
  }}
  class="hot-spot-canvas"
>
  <img
    src={createImageUrl(props)}
    width={hero.canvasWidth}
    height={hero.canvasHeight}
  />

  <ul>
    {#each hero.hotSpots as hotSpot}
      <li
        use:mitosis_styling={{
          left: `${hotSpot.coordinates.x}px`,
          top: `${hotSpot.coordinates.y}px`,
        }}
        class="hot-spot-canvas-hot-spot"
      >
        {#if hotSpot.content.contentType.includes("Page")}
          {pageWrapper(hotSpot)}
        {/if}

        {#if hotSpot.content.contentType.includes("Product")}
          {productWrapper(hotSpot)}
        {/if}

        {#if hotSpot.content.contentType.includes("Variation")}
          {variantWrapper(hotSpot)}
        {/if}
      </li>
    {/each}
  </ul>
</div>