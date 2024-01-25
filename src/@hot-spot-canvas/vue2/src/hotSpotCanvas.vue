<template>
  <div
    class="hot-spot-canvas"
    v-if="!!model"
    :style="{
      margin: '10px',
      display: 'flex',
      position: 'relative',
      overflow: 'visible',
      width: `${canvasWidth(props)}px`,
      height: `${canvasHeight(props)}px`,
    }"
  >
    <img
      :src="createImageUrl(props)"
      :width="canvasWidth(props)"
      :height="canvasHeight(props)"
    />

    <ul
      :style="{
        display: 'inline-flex',
        listStyle: 'none',
        margin: '0',
        padding: '0',
        overflow: 'visible',
      }"
    >
      <li
        class="hot-spot-canvas-hot-spot"
        v-for="(hotSpot, index) in model.hotSpots"
        :style="{
          display: 'flex',
          listStyle: 'none',
          margin: '0',
          padding: '0',
          overflow: 'visible',
          position: 'absolute',
          textDecoration: 'none',
          left: `${hotSpot.coordinates.x}px`,
          top: `${hotSpot.coordinates.y}px`,
        }"
        :key="index"
      >
        <template v-if="hotSpot.content.contentType.includes('Page')">
          <slot name="page" :hotSpot={...hotSpot}></slot>
        </template>

        <template v-if="hotSpot.content.contentType.includes('Product')">
          <slot name="product" :hotSpot={...hotSpot}></slot>
        </template>

        <template v-if="hotSpot.content.contentType.includes('Variation')">
          <slot name="variant" :hotSpot={...hotSpot}></slot>
        </template>
      </li>
    </ul>
  </div>
</template>

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

export default {
  name: "hot-spot-canvas",

  props: ["model", "siteHost"],

  methods: {
    createImageUrl: function createImageUrl(props: HotSpotCanvasProps) {
      if (!this.model) return null;
      const imageUrl = new URL(this.model.imageUrl, this.siteHost);
      imageUrl.searchParams.append(
        "w",
        this.canvasWidth(this.props).toString()
      );
      imageUrl.searchParams.append(
        "h",
        this.canvasHeight(this.props).toString()
      );
      imageUrl.searchParams.append("mode", "crop");
      return imageUrl.toString();
    },
    canvasWidth: function canvasWidth(props: HotSpotCanvasProps) {
      return this.model?.canvasWidth ?? 0;
    },
    canvasHeight: function canvasHeight(props: HotSpotCanvasProps) {
      return this.model?.canvasHeight ?? 0;
    },
  },
};
</script>