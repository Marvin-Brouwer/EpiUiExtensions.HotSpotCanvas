<template>
  <div
    class="hot-spot-canvas"
    v-if="!!model"
    :style="{
      margin: '10px',
      display: 'flex',
      position: 'relative',
      overflow: 'visible',
      width: `${canvasMetaData.width}px`,
      height: `${canvasMetaData.height}px`,
    }"
  >
    <img
      :src="canvasMetaData.url"
      :width="canvasMetaData.width"
      :height="canvasMetaData.height"
      :alt="canvasAltText"
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
          left: `${hotSpot.coordinates.x}%`,
          top: `${hotSpot.coordinates.y}%`,
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

export default {
  name: "hot-spot-canvas",

  props: {
    model: { default: undefined },
    canvasAltText: {
      default: "A canvas containing hot-spots referencing pages and products",
    },
    canvasWidth: { default: undefined },
    canvasHeight: { default: undefined },
    siteHost: { default: undefined },
  },

  data() {
    return {
      canvasMetaData: {
        width: this.model.canvasDimensions.defaultWidth,
        height: this.model.canvasDimensions.defaultHeight,
        url: undefined,
      },
    };
  },

  mounted() {
    const calculateWidth = () => {
      if (this.canvasWidth) return this.canvasWidth;
      if (this.canvasHeight)
        return this.canvasHeight / this.model.canvasDimensions.aspectRatio;
      return this.model.canvasDimensions.defaultWidth;
    };
    const calculateHeight = () => {
      if (this.canvasHeight) return this.canvasHeight;
      if (this.canvasWidth)
        return this.canvasWidth * this.model.canvasDimensions.aspectRatio;
      return this.model.canvasDimensions.defaultHeight;
    };
    const width = calculateWidth();
    const height = calculateHeight();
    const createImageUrl = () => {
      if (!this.model) return null;
      const imageUrl = new URL(this.model.imageUrl, this.siteHost);
      imageUrl.searchParams.append("w", width.toString());
      imageUrl.searchParams.append("h", height.toString());
      imageUrl.searchParams.append("mode", "crop");
      return imageUrl.toString();
    };
    this.canvasMetaData = {
      width,
      height,
      url: createImageUrl(),
    };
  },
};
</script>