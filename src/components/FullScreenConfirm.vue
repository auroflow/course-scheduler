<template>
  <div v-if="modelValue" class="alert">
    <div class="content">
      <p><slot></slot></p>
      <div class="buttons">
        <button class="button" @click="confirm">确认</button>
        <button class="button" @click="cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    confirm() {
      this.$emit('update:modelValue', false)
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('update:modelValue', false)
      this.$emit('cancel')
    },
  },
})
</script>

<style scoped>
.alert {
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}
.content {
  position: fixed;
  background-color: #fefefe;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #888;
  padding: 2rem;
  width: 400px;
}

.buttons > * {
  margin: 0;
}
</style>
