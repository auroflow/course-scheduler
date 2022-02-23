<!-- To pass course and section to this component, make sure     -->
<!-- the section is displayable, i.e. section.start, section.end -->
<!-- and section.weekday are not null.                           -->
<template>
  <div
    v-bind="$attrs"
    v-if="section.start && section.end && section.weekday"
    class="entry"
    :style="getPosition"
    :class="{ selected: isSelected }"
    draggable="true"
    @dragstart="dragStart($event, 'entry')"
    @drag="onDrag"
    @dragend="dragEnd"
    @dragover.prevent
  >
    <div class="text">
      <div class="course-title">{{ course.title }}</div>
      <div class="course-subtitle">{{ section.location }}</div>
    </div>

    <!-- draggable -->
    <div
      draggable="true"
      v-show="isSelected"
      class="draggable top"
      @dragstart.stop="dragStart($event, 'top')"
      @drag.stop="onDrag"
      @dragend.stop="dragEnd"
    ></div>
    <div
      draggable="true"
      v-show="isSelected"
      class="draggable bottom"
      @dragstart.stop="dragStart($event, 'bottom')"
      @drag.stop="onDrag"
      @dragend.stop="dragEnd"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useScheduleStore } from '../stores/schedule'
import { useTimetableStore } from '../stores/timetable'
import { CourseOnEdit, SectionOnEdit } from '../types'

export default defineComponent({
  setup() {
    const scheduleStore = useScheduleStore()
    const timetableStore = useTimetableStore()
    return { scheduleStore, timetableStore }
  },

  props: {
    course: {
      type: Object as PropType<CourseOnEdit>,
      required: true,
    },
    section: {
      type: Object as PropType<SectionOnEdit>,
      required: true,
    },
  },

  computed: {
    isSelected() {
      return this.scheduleStore.selectedSection === this.section
    },

    timeslots() {
      return this.timetableStore.timeslots
    },

    getPosition() {
      return {
        gridArea: `${this.section.start! + 1} / ${
          this.section.weekday! + 1
        } / ${this.section.end! + 2} / span 1`,
      }
    },
  },

  methods: {
    unitHeight() {
      const cnt = Math.max(this.timeslots.length, 1)
      return (document.getElementById('calendar')!.offsetHeight - 25) / cnt
    },

    unitWidth() {
      return (document.getElementById('calendar')!.offsetWidth - 25) / 7
    },

    dragStart(e: DragEvent, type: 'top' | 'bottom' | 'entry') {
      this.scheduleStore.startClientX = e.clientX
      this.scheduleStore.startClientY = e.clientY
      this.scheduleStore.dragType = type
      this.scheduleStore.startSectionStart = this.section.start
      this.scheduleStore.startSectionEnd = this.section.end
      this.scheduleStore.startWeekday = this.section.weekday

      // hide drag preview
      let p = document.createElement('span')
      p.id = 'magic-drag-image'
      p.style.display = 'hidden'
      document.body.appendChild(p)
      e.dataTransfer!.setDragImage(p, 0, 0)
    },

    dragEnd(e: DragEvent) {
      this.scheduleStore.startClientX = null
      this.scheduleStore.startClientY = null
      this.scheduleStore.dragType = null
      this.scheduleStore.startSectionStart = null
      this.scheduleStore.startSectionEnd = null
      this.scheduleStore.startWeekday = null

      document.getElementById('magic-drag-image')?.remove()
    },

    getDelta(e: DragEvent) {
      let dayDelta = 0,
        weekDelta = 0

      if (this.scheduleStore.startClientX && this.scheduleStore.startClientY) {
        dayDelta =
          (e.clientX - this.scheduleStore.startClientX) / this.unitWidth()
        weekDelta =
          (e.clientY - this.scheduleStore.startClientY) / this.unitHeight()
      }

      return {
        day: Math.round(dayDelta),
        section: Math.round(weekDelta),
      }
    },

    // handle dragging
    onDrag(e: DragEvent) {
      const type = this.scheduleStore.dragType
      const delta = this.getDelta(e)

      console.log('delta = (' + delta.day + ', ' + delta.section + ')')

      if (type === 'top') {
        const section = this.scheduleStore.startSectionStart! + delta.section
        if (section <= this.section.end! && section >= 1) {
          this.section.start = section
        }
      } else if (type === 'bottom') {
        const section = this.scheduleStore.startSectionEnd! + delta.section
        if (
          section >= this.section.start! &&
          section <= this.timeslots.length
        ) {
          this.section.end = section
        }
      } else {
        // type === 'entry'
        const newWeekday = this.scheduleStore.startWeekday! + delta.day
        const newStart = this.scheduleStore.startSectionStart! + delta.section
        const newEnd = this.scheduleStore.startSectionEnd! + delta.section

        if (newWeekday < 1 || newWeekday > 7) return
        if (newStart < 1 || newStart > this.timeslots.length) return
        if (newEnd < 1 || newEnd > this.timeslots.length) return

        this.section.weekday = newWeekday
        this.section.start = newStart
        this.section.end = newEnd
      }
    },
  },
})
</script>

<style scoped>
.entry {
  position: relative;
  margin: 2px;
  background-color: rgb(197, 241, 255);
  color: royalblue;
  z-index: 1;
  cursor: default;
  min-height: 0;
}

.entry:before {
  content: '';
  background-color: royalblue;
  display: block;
  position: relative;
  width: 4px;
  height: 100%;
}

.text {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 2px 7px;
}

.selected {
  background-color: royalblue;
  color: white;
}

.course-title {
  font-size: 12px;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: calc(70% - 2px);
}

.course-subtitle {
  font-size: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: calc(30% - 1px);
}

.draggable {
  position: absolute;
  background-color: white;
  border: 2px solid royalblue;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  cursor: ns-resize;
}

.draggable.top {
  top: -4px;
  left: 10%;
}

.draggable.bottom {
  bottom: -4px;
  right: 10%;
}
</style>
