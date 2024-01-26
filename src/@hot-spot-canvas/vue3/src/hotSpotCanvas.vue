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
      <div
        :style="{
          margin: '0',
          padding: '0',
          position: 'relative',
          display: 'flex',
          overflow: 'hidden',
        }"
      >
        <img
          :src="canvasMetaData.url"
          :width="canvasMetaData.imageWidth"
          :height="canvasMetaData.imageHeight"
          :alt="canvasAltText"
          :style="{
            margin: '0',
            padding: '0',
            position: 'absolute',
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }"
        />
      </div>

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
        imageWidth: this.model.canvasDimensions.defaultWidth,
        imageHeight: this.model.canvasDimensions.defaultHeight,
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
    if (height > width) {
      this.canvasMetaData = {
        ...this.canvasMetaData,
        imageWidth: null,
      };
    } else {
      this.canvasMetaData = {
        ...this.canvasMetaData,
        imageHeight: null,
      };
    }
    const createImageUrl = () => {
      if (!this.model) return null;
      const imageUrl = new URL(this.model.imageUrl, this.siteHost);
      if (this.canvasMetaData.imageWidth) {
        imageUrl.searchParams.append(
          "w",
          this.canvasMetaData.imageWidth.toString()
        );
      }
      if (this.canvasMetaData.imageHeight) {
        imageUrl.searchParams.append(
          "h",
          this.canvasMetaData.imageHeight.toString()
        );
      }
      return imageUrl.toString();
    };
    this.canvasMetaData = {
      ...this.canvasMetaData,
      width,
      height,
      url: createImageUrl(),
    };
  },
});
</script>