<template>
  <div class="quarter-switch">
    <button class="switch" :disabled="quarterIdx === 0" @click.stop="selectQuarter(quarterIdx - 1)">
      <font-awesome-icon icon="left-long" aria-hidden="true" fixed-width />
      <span class="sr-only">上一学期</span>
    </button>
    <div>{{ quarters[quarterIdx].name }}</div>
    <button
      class="switch"
      :disabled="quarterIdx === quarters.length - 1"
      @click.stop="selectQuarter(quarterIdx + 1)"
    >
      <font-awesome-icon icon="right-long" aria-hidden="true" fixed-width />
      <span class="sr-only">下一学期</span>
    </button>
  </div>

  <div id="calendar" v-if="quarterIdx >= 0 && quarterIdx < quarters.length" class="calendar">
    <div class="cell cell-top cell-left" :style="getPosition(0, 0, 1)"></div>
    <div
      v-for="(weekday, index) in weekdays"
      :key="index"
      class="cell cell-top"
      :style="getPosition(index + 1, 0, 1)"
    >
      <span>{{ weekday }}</span>
    </div>
    <template v-for="session in numSession" :key="session">
      <div class="cell cell-left" :style="getPosition(0, session, 1)">
        {{ session }}
      </div>
      <div
        v-for="weekday in 7"
        :key="weekday * session"
        class="cell"
        :style="getPosition(weekday, session, 1)"
        @click.stop="removeSelect"
        @contextmenu.prevent.stop="invokeMenu($event, weekday, session)"
        @dragover.prevent
      ></div>
    </template>

    <template v-for="(course, cidx) in coursesInCurrentQuarter" :key="cidx">
      <CourseCalendarEntry
        v-for="(session, sidx) in course.sessions"
        :key="sidx"
        :course="course"
        :session="session"
        @click.stop="selectCourseAndSession(course, session)"
      />
    </template>
  </div>

  <CourseCalendarCreate
    :show="menu.show"
    :hasSelected="!!selectedCourse"
    :top="menu.top"
    :left="menu.left"
    @add-session-for-new="addCourse(menu.weekday, menu.session)"
    @add-session-for-this="addSessionToSelectedCourse(menu.weekday, menu.session)"
  />
</template>

<script>
import { defineComponent } from 'vue'
import { useScheduleStore } from '../stores/schedule'
import { mapStores } from 'pinia'
import CourseCalendarEntry from './CourseCalendarEntry.vue'
import CourseCalendarCreate from './CourseCalendarCreate.vue'
import { useSemesterStore } from '../stores/semester'

export default defineComponent({
  data: () => ({
    weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    log: console.log,
    menu: {
      show: false,
      weekday: null,
      session: null,
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

  computed: {
    ...mapStores(useScheduleStore, useSemesterStore),

    selectedCourse() {
      return this.scheduleStore.selectedCourse
    },

    selectedSession() {
      return this.scheduleStore.selectedSession
    },

    quarterIdx() {
      return this.semesterStore.selected
    },

    numSession() {
      return this.semesterStore.timeslots.length
    },

    courses() {
      return this.scheduleStore.courses
    },

    quarters() {
      return this.semesterStore.quarters
    },

    timeslots() {
      return this.semesterStore.timeslots
    },

    coursesInCurrentQuarter() {
      return this.courses.filter((course) => course.quarters.includes(this.quarterIdx))
    },
  },

  methods: {
    selectQuarter(newIndex) {
      this.semesterStore.selected = newIndex
    },

    getPosition(weekday, timeslot, duration) {
      return {
        gridArea: `${timeslot + 1} / ${weekday + 1} / span ${duration} / span 1`,
        backgroundColor: timeslot % 2 ? '#fafafa' : '#f0f0f0',
      }
    },

    selectCourseAndSession(course, session) {
      this.scheduleStore.select(course, session)
      let cidx = this.scheduleStore.courses.indexOf(course)
      this.scheduleStore.showCourseBox[cidx] = true
      this.$nextTick(() => {
        document.getElementById(`course-${cidx}`).scrollIntoView()
      })
    },

    removeSelect() {
      console.log('removed')

      this.scheduleStore.select(null, null)
    },

    invokeMenu(e, weekday, session) {
      this.menu.top = e.clientY
      this.menu.left = e.clientX
      this.menu.weekday = weekday
      this.menu.session = session
      this.menu.show = true
    },

    addCourse(weekday, session) {
      const newCourse = this.scheduleStore.addCourse()
      newCourse.sessions.push({
        weekday: weekday,
        start: session,
        end: session,
        location: '',
        note: '',
        freq: { type: 0 },
      })
      let cidx = this.courses.indexOf(newCourse)
      console.log(cidx)
      this.scheduleStore.showCourseBox[cidx] = true
      this.$nextTick(() => {
        document.getElementById(`course-${cidx}`).scrollIntoView()
      })
    },

    // invoked only when this.selectedCourse !== null.
    addSessionToSelectedCourse(weekday, session) {
      let newSession = {
        weekday: weekday,
        start: session,
        end: session,
        location: '',
        note: '',
        freq: { type: 0 },
      }

      this.selectedCourse.sessions.push(newSession)
      this.selectCourseAndSession(this.selectedCourse, newSession)
    },
  },

  components: { CourseCalendarEntry, CourseCalendarCreate },
})
</script>

<style scoped>
button.switch {
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0 10px;
}

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
