# Examples

> [!TODO]
> Write up some usage text

## vue

<!-- markdownlint-disable MD033 -->
<details>
  <summary>AppHotSpotCanvas.vue.ts</summary>

```ts
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import HotSpotCanvas, { HotSpotViewModel } from '@epi-ui-hot-spot-canvas/vue2'

export default defineComponent({
  name: 'AppHotSpotCanvas',
  props: {
    content: {
      type: Object,
      required: true,
    },
    propertyName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const propertyName = props.propertyName as string
    const content = props.content as any

    const { $config } = useContext()
    const contentBaseURL = ref<string>($config.contentBaseURL)

    const heroContent: HotSpotViewModel = content[propertyName]

    return {
      contentBaseURL,
      heroContent,
    }
  },
  components: { HotSpotCanvas },
})

```

</details>

<details>
  <summary>AppHotSpotCanvas.vue</summary>

```vue
<template>
  <section class="app-hot-spot-canvas">
    <HotSpotCanvas
      v-if="!!heroContent"
      :site-host="contentBaseURL"
      :model="heroContent"
    >
      <template #page="{ hotSpot }">
        <div class="hot-spot-wrapper">
          <template v-slot:content>
            <PageCard
              :content="hotSpot.content"
              :content-url="hotSpot.contentUrl"
            />
          </template>
        </div>
      </template>
      <template v-slot:product="{ hotSpot }">
        <div class="hot-spot-wrapper">
          <template v-slot:content>
            <ProductCard :product="hotSpot" />
          </template>
        </div>
      </template>
      <template v-slot:variant="{ hotSpot }">
        <div class="hot-spot-wrapper">
          <template v-slot:content>
            <VariantCard :variant="hotSpot" />
          </template>
        </div>
      </template>
    </HotSpotCanvas>
  </section>
</template>
<script lang="ts" src="./AppHotSpotCanvas.vue.ts"></script>
<style lang="postcss" src="./AppHotSpotCanvas.vue.pcss"></style>
```

</details>
<!-- markdownlint-enable MD033 -->