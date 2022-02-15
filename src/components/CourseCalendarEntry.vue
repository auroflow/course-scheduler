<template>
  <div
    v-if="section.start && section.end && section.weekday"
    class="entry"
    :style="
      getPosition(
        section.weekday,
        section.start,
        section.end - section.start + 1
      )
    "
    :class="{ selected: isSelected }"
  >
    <div class="course-title">{{ course.title }}</div>
    <div class="course-subtitle">{{ section.location }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useScheduleStore } from '../stores/schedule'
import { Course, Section } from '../types'

export default defineComponent({
  setup() {
    const scheduleStore = useScheduleStore()
    return { scheduleStore }
  },

  props: {
    course: {
      type: Object as PropType<Course>,
      required: true,
    },
    section: {
      type: Object as PropType<Section>,
      required: true,
    },
  },

  computed: {
    isSelected() {
      return this.scheduleStore.selectedSection === this.section
    },
  },

  methods: {
    getPosition(weekday: number, timeslot: number, duration: number) {
      return {
        gridArea: `${timeslot + 1} / ${
          weekday + 1
        } / span ${duration} / span 1`,
      }
    },
  },
})
</script>

<style scoped>
.entry {
  margin: 2px;
  padding: 2px;
  border-radius: 5px;
  background-color: rgb(197, 241, 255);
  color: royalblue;
  z-index: 1;
}

.selected {
  background-color: royalblue;
  color: white;
}

.course-title {
  font-size: 12px;
  font-weight: bold;
}

.course-subtitle {
  font-size: 10px;
}
</style>
