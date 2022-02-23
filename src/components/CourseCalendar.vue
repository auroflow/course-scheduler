<template>
  <div class="quarter-switch">
    <button
      class="switch"
      :disabled="quarterIdx === 0"
      @click="selectQuarter(quarterIdx - 1)"
    >
      ←
    </button>
    <div>{{ quarters[quarterIdx].name }}</div>
    <button
      class="switch"
      :disabled="quarterIdx === quarters.length - 1"
      @click="selectQuarter(quarterIdx + 1)"
    >
      →
    </button>
  </div>

  <div
    id="calendar"
    v-if="quarterIdx >= 0 && quarterIdx < quarters.length"
    class="calendar"
  >
    <div class="cell cell-top cell-left" :style="getPosition(0, 0, 1)"></div>
    <div
      v-for="(weekday, index) in weekdays"
      :key="index"
      class="cell cell-top"
      :style="getPosition(index + 1, 0, 1)"
    >
      <span>{{ weekday }}</span>
    </div>
    <template v-for="section in numSection" :key="section">
      <div class="cell cell-left" :style="getPosition(0, section, 1)">
        {{ section }}
      </div>
      <div
        v-for="weekday in 7"
        :key="weekday * section"
        class="cell"
        :style="getPosition(weekday, section, 1)"
        @click="removeSelect"
        @contextmenu.prevent.stop="invokeMenu($event, weekday, section)"
        @dragover.prevent
      ></div>
    </template>

    <template v-for="(course, cidx) in coursesInCurrentQuarter" :key="cidx">
      <CourseCalendarEntry
        v-for="(section, sidx) in course.sections"
        :key="sidx"
        :course="course"
        :section="section"
        @click="selectCourseAndSection(course, section)"
      />
    </template>
  </div>

  <CourseCalendarCreate
    :show="menu.show"
    :hasSelected="!!selectedSection"
    :top="menu.top"
    :left="menu.left"
    @add-section-for-new="addCourse(menu.weekday!, menu.section!)"
    @add-section-for-this="addSectionToSelectedCourse(menu.weekday!, menu.section!)"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useTimetableStore } from '../stores/timetable'
import { useScheduleStore } from '../stores/schedule'
import { mapStores } from 'pinia'
import CourseCalendarEntry from './CourseCalendarEntry.vue'
import CourseCalendarCreate from './CourseCalendarCreate.vue'
import { CourseOnEdit, SectionOnEdit } from '../types'
import { useSemesterStore } from '../stores/semester'

export default defineComponent({
  data: () => ({
    weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    log: console.log,
    menu: {
      show: false,
      weekday: null as number | null,
      section: null as number | null,
      top: 0,
      left: 0,
    },
    newCourseCount: 0,
  }),

  mounted() {
    document.addEventListener('click', () => {
      this.menu.show = false
    })
  },

  emits: ['section-selected'],

  computed: {
    ...mapStores(useTimetableStore, useScheduleStore, useSemesterStore),

    selectedCourse() {
      return this.scheduleStore.selectedCourse
    },

    selectedSection() {
      return this.scheduleStore.selectedSection
    },

    quarterIdx() {
      return this.semesterStore.selected
    },

    numSection() {
      return this.timetableStore.timeslots.length
    },

    courses(): CourseOnEdit[] {
      return this.scheduleStore.courses
    },

    quarters() {
      return this.semesterStore.quarters
    },

    timeslots() {
      return this.timetableStore.timeslots
    },

    coursesInCurrentQuarter() {
      return this.courses.filter(
        (course) =>
          course.quarterStart !== null &&
          course.quarterEnd !== null &&
          course.quarterStart <= this.quarterIdx &&
          this.quarterIdx <= course.quarterEnd
      )
    },
  },

  methods: {
    selectQuarter(newIndex: number) {
      this.semesterStore.selected = newIndex
    },

    getPosition(weekday: number, timeslot: number, duration: number) {
      return {
        gridArea: `${timeslot + 1} / ${
          weekday + 1
        } / span ${duration} / span 1`,
        backgroundColor: timeslot % 2 ? '#fafafa' : '#f0f0f0',
      }
    },

    selectCourseAndSection(course: CourseOnEdit, section: SectionOnEdit) {
      this.scheduleStore.select(course, section)
      this.$emit('section-selected')
    },

    removeSelect() {
      console.log('removed')

      this.scheduleStore.select(null, null)
    },

    invokeMenu(e: MouseEvent, weekday: number, section: number) {
      this.menu.top = e.clientY
      this.menu.left = e.clientX
      this.menu.weekday = weekday
      this.menu.section = section
      this.menu.show = true
    },

    addCourse(weekday: number, section: number) {
      let newCourse = {
        quarterStart: this.quarterIdx,
        quarterEnd: this.quarters.length - 1,
        title: '新课程 #' + ++this.newCourseCount,
        instructor: '',
        sections: [
          {
            weekday: weekday,
            start: section,
            end: section,
            location: '',
            note: '',
          },
        ],
        exams: [],
      }

      this.courses.push(newCourse)
      this.selectCourseAndSection(newCourse, newCourse.sections[0])
    },

    // invoked only when this.selectedCourse !== null.
    addSectionToSelectedCourse(weekday: number, section: number) {
      let newSection = {
        weekday: weekday,
        start: section,
        end: section,
        location: '',
        note: '',
      }

      this.selectedCourse!.sections.push(newSection)
      this.selectCourseAndSection(this.selectedCourse!, newSection)
    },
  },

  components: { CourseCalendarEntry, CourseCalendarCreate },
})
</script>

<style scoped>
.quarter-switch {
  display: flex;
  font-size: 14px;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 25px;
}

.switch {
  margin: 0 10px;
}

.calendar {
  display: grid;
  grid-template-columns: 25px repeat(7, 1fr);
  grid-template-rows: 25px repeat(v-bind('timeslots.length'), 1fr);
  height: calc(100% - 30px);
  box-sizing: border-box;
  overflow-y: hidden;
}

.cell {
  border: 1px solid white;
  font-size: 15px;
  text-align: center;
}

/* 标题行 */
.cell-top {
  height: 25px;
  box-sizing: border-box;
  color: darkslategrey;
  text-align: center;
}

/* 标题列 */
.cell-left {
  width: 25px;
  box-sizing: border-box;
  min-height: 0;
  color: darkslategrey;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0 !important;
}

.cell-right {
  border-right: 1px solid black !important;
}

.cell-bottom {
  border-bottom: 1px solid black !important;
}
</style>
