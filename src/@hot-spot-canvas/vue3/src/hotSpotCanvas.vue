<template>
  <template v-if="!!model">
    <div
      class="hot-spot-canvas"
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
        <template :key="index" v-for="(hotSpot, index) in model.hotSpots">
          <li
            class="hot-spot-canvas-hot-spot"
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
</template>

<script lang="ts">
import { defineComponent } from "vue";

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

export default defineComponent({
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
});
</script>