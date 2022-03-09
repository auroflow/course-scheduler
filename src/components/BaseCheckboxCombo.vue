<template>
  <div>
    <template v-for="(label, index) in labels" :key="`${uid}-${index}`">
      <input
        type="checkbox"
        :id="`checkbox-${index}-${uid}`"
        :checked="selected.includes(index)"
        @change="onChange($event, index)"
      />
      <label :for="`checkbox-${index}-${uid}`">{{ label }}</label>
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
    selected: {
      type: Array,
      required: true,
    },
  },

  setup() {
    let uid = _uid++

    return { uid }
  },

  methods: {
    onChange(event, index) {
      if (event.target.checked) {
        this.selected.push(index)
      } else {
        let idx = this.selected.indexOf(index)
        if (idx !== -1) {
          this.selected.splice(idx, 1)
        }
      }
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
