<!-- To pass course and session to this component, make sure     -->
<!-- the session is displayable, i.e. session.start, session.end -->
<!-- and session.weekday are not null.                           -->
<template>
  <div
    v-bind="$attrs"
    v-if="session.start && session.end && session.weekday"
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
      <div class="course-subtitle">{{ session.location }}</div>
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

<script>
import { defineComponent } from 'vue'
import { useScheduleStore } from '../stores/schedule'
import { useTimetableStore } from '../stores/timetable'

export default defineComponent({
  setup() {
    const scheduleStore = useScheduleStore()
    const timetableStore = useTimetableStore()
    return { scheduleStore, timetableStore }
  },

  props: {
    course: {
      type: Object,
      required: true,
    },
    session: {
      type: Object,
      required: true,
    },
  },

  computed: {
    isSelected() {
      return this.scheduleStore.selectedSession === this.session
    },

    timeslots() {
      return this.timetableStore.timeslots
    },

    getPosition() {
      return {
        gridArea: `${this.session.start + 1} / ${this.session.weekday + 1} / ${
          this.session.end + 2
        } / span 1`,
      }
    },
  },

  methods: {
    unitHeight() {
      const cnt = Math.max(this.timeslots.length, 1)
      return (document.getElementById('calendar').offsetHeight - 25) / cnt
    },

    unitWidth() {
      return (document.getElementById('calendar').offsetWidth - 25) / 7
    },

    dragStart(e, type) {
      this.scheduleStore.select(this.course, this.session)

      this.scheduleStore.startClientX = e.clientX
      this.scheduleStore.startClientY = e.clientY
      this.scheduleStore.dragType = type
      this.scheduleStore.startSessionStart = this.session.start
      this.scheduleStore.startSessionEnd = this.session.end
      this.scheduleStore.startWeekday = this.session.weekday

      // hide drag preview
      let p = document.createElement('span')
      p.id = 'magic-drag-image'
      p.style.display = 'hidden'
      document.body.appendChild(p)
      e.dataTransfer.setDragImage(p, 0, 0)
    },

    dragEnd(e) {
      this.scheduleStore.startClientX = null
      this.scheduleStore.startClientY = null
      this.scheduleStore.dragType = null
      this.scheduleStore.startSessionStart = null
      this.scheduleStore.startSessionEnd = null
      this.scheduleStore.startWeekday = null

      document.getElementById('magic-drag-image')?.remove()
    },

    getDelta(e) {
      let dayDelta = 0,
        weekDelta = 0

      if (this.scheduleStore.startClientX && this.scheduleStore.startClientY) {
        dayDelta = (e.clientX - this.scheduleStore.startClientX) / this.unitWidth()
        weekDelta = (e.clientY - this.scheduleStore.startClientY) / this.unitHeight()
      }

      return {
        day: Math.round(dayDelta),
        session: Math.round(weekDelta),
      }
    },

    // handle dragging
    onDrag(e) {
      const type = this.scheduleStore.dragType
      const delta = this.getDelta(e)

      console.log('delta = (' + delta.day + ', ' + delta.session + ')')

      if (type === 'top') {
        const session = this.scheduleStore.startSessionStart + delta.session
        if (session <= this.session.end && session >= 1) {
          this.session.start = session
        }
      } else if (type === 'bottom') {
        const session = this.scheduleStore.startSessionEnd + delta.session
        if (session >= this.session.start && session <= this.timeslots.length) {
          this.session.end = session
        }
      } else {
        // type === 'entry'
        const newWeekday = this.scheduleStore.startWeekday + delta.day
        const newStart = this.scheduleStore.startSessionStart + delta.session
        const newEnd = this.scheduleStore.startSessionEnd + delta.session

        if (newWeekday < 1 || newWeekday > 7) return
        if (newStart < 1 || newStart > this.timeslots.length) return
        if (newEnd < 1 || newEnd > this.timeslots.length) return

        this.session.weekday = newWeekday
        this.session.start = newStart
        this.session.end = newEnd
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
  font-size: 11px;
  line-height: 1.2;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: 26.4px;
}

.course-subtitle {
  padding-top: 0.1em;
  font-size: 10px;
  line-height: 1.1;
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: 22px;
}

.draggable {
  position: absolute;
  background-color: white;
  border: 2px solid royalblue;
  width: 8px;
  height: 8px;
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
