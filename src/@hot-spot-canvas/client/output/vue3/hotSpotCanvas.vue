<template>
  <div
    class="hot-spot-canvas"
    :style="{
      width: `${hero.canvasWidth}px`,
      height: `${hero.canvasHeight}px`,
    }"
  >
    <img
      :src="createImageUrl(props)"
      :width="hero.canvasWidth"
      :height="hero.canvasHeight"
    />

    <ul>
      <template :key="index" v-for="(hotSpot, index) in hero.hotSpots">
        <li
          class="hot-spot-canvas-hot-spot"
          :style="{
            left: `${hotSpot.coordinates.x}px`,
            top: `${hotSpot.coordinates.y}px`,
          }"
        >
          <template v-if="hotSpot.content.contentType.includes('Page')">
            {{ pageWrapper(hotSpot) }}
          </template>

          <template v-if="hotSpot.content.contentType.includes('Product')">
            {{ productWrapper(hotSpot) }}
          </template>

          <template v-if="hotSpot.content.contentType.includes('Variation')">
            {{ variantWrapper(hotSpot) }}
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
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

const props = defineProps<HotSpotCanvasProps>();

function createImageUrl(props: HotSpotCanvasProps) {
  const imageUrl = new URL(props.hero.imageUrl, props.siteHost);
  imageUrl.searchParams.append("w", props.hero.canvasWidth.toString());
  imageUrl.searchParams.append("h", props.hero.canvasHeight.toString());
  imageUrl.searchParams.append("mode", "crop");
  return imageUrl.toString();
}
</script>