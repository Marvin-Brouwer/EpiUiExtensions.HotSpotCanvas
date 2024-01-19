<template>
  <div
    class="hot-spot-canvas"
    :style="{
      width: `${model.canvasWidth}px`,
      height: `${model.canvasHeight}px`,
    }"
  >
    <img
      :src="createImageUrl(props)"
      :width="model.canvasWidth"
      :height="model.canvasHeight"
    />

    <ul>
      <template :key="index" v-for="(hotSpot, index) in model.hotSpots">
        <li
          class="hot-spot-canvas-hot-spot"
          :style="{
            left: `${hotSpot.coordinates.x}px`,
            top: `${hotSpot.coordinates.y}px`,
          }"
        >
          <template v-if="hotSpot.content.contentType.includes('Page')">
            <slot name="page"></slot>
          </template>

          <template v-if="hotSpot.content.contentType.includes('Product')">
            <slot name="product"></slot>
          </template>

          <template v-if="hotSpot.content.contentType.includes('Variation')">
            <slot name="variant"></slot>
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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
  model: HotSpotCanvasViewModel<T>;
};

export default defineComponent({
  name: "hot-spot-canvas",

  props: ["model", "siteHost"],

  methods: {
    createImageUrl: function createImageUrl(props: HotSpotCanvasProps) {
      const imageUrl = new URL(this.model.imageUrl, this.siteHost);
      imageUrl.searchParams.append("w", this.model.canvasWidth.toString());
      imageUrl.searchParams.append("h", this.model.canvasHeight.toString());
      imageUrl.searchParams.append("mode", "crop");
      return imageUrl.toString();
    },
  },
});
</script>