<template>
  <div class="quarter-switch">
    <button class="switch" :disabled="quarterIdx === 0" @click="quarterIdx--">
      ←
    </button>
    <div>{{ quarters[quarterIdx].name }}</div>
    <button
      class="switch"
      :disabled="quarterIdx === quarters.length - 1"
      @click="quarterIdx++"
    >
      →
    </button>
  </div>

  <div class="calendar">
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
        :class="{
          'cell-right': weekday === 7,
          'cell-bottom': section === numSection,
        }"
        :style="getPosition(weekday, section, 1)"
        @click="removeSelect"
      ></div>
    </template>

    <template v-for="(course, cidx) in coursesInCurrentQuarter" :key="cidx">
      <CourseCalendarEntry
        v-for="(section, sidx) in course.sections"
        :key="sidx"
        :course="course"
        :section="section"
        @click="select(course, section)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useTimetableStore } from '../stores/timetable'
import { useScheduleStore } from '../stores/schedule'
import { mapStores } from 'pinia'
import CourseCalendarEntry from './CourseCalendarEntry.vue'
import { Course, CourseOnEdit, Section, SectionOnEdit } from '../types'
import { useSemesterStore } from '../stores/semester'

export default defineComponent({
  data: () => ({
    quarterIdx: 0,
    weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  }),

  computed: {
    ...mapStores(useTimetableStore, useScheduleStore, useSemesterStore),

    numSection() {
      return this.timetableStore.timeslots.length
    },

    courses(): CourseOnEdit[] {
      return this.scheduleStore.courses
    },

    quarters() {
      return this.semesterStore.quarters
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
    getPosition(weekday: number, timeslot: number, duration: number) {
      return {
        gridArea: `${timeslot + 1} / ${
          weekday + 1
        } / span ${duration} / span 1`,
      }
    },

    select(course: CourseOnEdit, section: SectionOnEdit) {
      this.scheduleStore.select(course, section)
    },

    removeSelect() {
      this.scheduleStore.select(null, null)
    },
  },

  components: { CourseCalendarEntry },
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
  grid-template-rows: 20px;
  height: calc(100% - 25px);
  box-sizing: border-box;
}

.cell {
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
  font-size: 15px;
  text-align: center;
}

/* 标题行 */
.cell-top {
  border-top: 1px solid black;
  border-right: 1px solid black !important;
  border-bottom: 1px solid black !important;
  height: 20px;
}

/* 标题列 */
.cell-left {
  border-left: 1px solid black;
  border-right: 1px solid black !important;
  border-bottom: 1px solid black !important;
  width: 24px;
}

.cell-right {
  border-right: 1px solid black !important;
}

.cell-bottom {
  border-bottom: 1px solid black !important;
}
/* 文字 */
</style>
