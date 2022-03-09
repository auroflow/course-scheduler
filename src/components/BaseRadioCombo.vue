<template>
  <div>
    <template v-for="(label, index) in labels" :key="`${uid}-${index}`">
      <input
        type="radio"
        :id="`input-frequency-${index}-${uid}`"
        :value="index"
        v-model="picked"
        @input="onInput(index)"
      />
      <label :for="`input-frequency-${index}-${uid}`" v-bind="$attrs">{{ label }}</label>
    </template>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

let _uid = 0

export default defineComponent({
  props: {
    labels: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Number,
      required: true,
    },
  },

  setup() {
    let uid = _uid++
    return { uid }
  },

  data() {
    return {
      picked: this.modelValue,
    }
  },

  methods: {
    onInput(index) {
      this.$emit('update:modelValue', index)
    },
  },
})
</script>

<style scoped>
div {
  display: flex;
  align-items: center;
}
</style>
