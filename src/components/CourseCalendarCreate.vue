<template>
  <Transition>
    <ul v-if="show && top && left">
      <li v-if="hasSelected" @click="$emit('add-session-for-this')">为选中的课程添加课时</li>
      <li @click="$emit('add-session-for-new')">创建新课程并添加课时</li>
    </ul>
  </Transition>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    hasSelected: {
      type: Boolean,
      required: true,
    },
    top: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
  },
  emits: ['add-session-for-this', 'add-session-for-new'],
})
</script>

<style scoped>
ul {
  position: fixed;
  top: v-bind("top + 'px'");
  left: v-bind("left + 'px'");
  background-color: #ededed;
  z-index: 100;
  margin: 0;
  padding: 5px 0;
  list-style-type: none;
}

li {
  font-size: 14px;
  margin: 0;
  padding: 5px 10px;
  cursor: default;
}

li:hover {
  background-color: #d2d2d2;
}

/* transition */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
