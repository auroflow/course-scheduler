<template>
  <div id="edit-form" @click="onClickForm">
    <button @click.stop="addCourse">
      <font-awesome-icon icon="circle-plus" aria-hidden="true" fixed-width />
      添加课程
    </button>

    <div
      class="course"
      v-for="(course, cidx) in courses"
      :id="`course-${cidx}`"
      :key="cidx"
      @click.stop="onClickCourse(course)"
      :class="{ selected: isSelected(course) }"
    >
      <div class="course-header" @click="showCourseBox[cidx] = !showCourseBox[cidx]">
        <button @click.stop="showCourseBox[cidx] = !showCourseBox[cidx]">
          <template v-if="showCourseBox[cidx]">
            <font-awesome-icon icon="caret-down" aria-hidden="true" />
            <span class="sr-only">收起</span>
          </template>
          <template v-else>
            <font-awesome-icon icon="caret-right" aria-hidden="true" />
            <span class="sr-only">展开</span>
          </template>
        </button>
        <h2>{{ course.title ? course.title : '未命名课程' }}</h2>
        <span>
          ({{ course.sessions.length }} 节{{
            course.exams.length ? `, ${course.exams.length} 考试` : ''
          }})
        </span>
        <button @click.stop="deleteCourse(cidx)">
          <span v-if="confirmingDelete(cidx, null, -1)">确定</span>
          <span v-else>
            <font-awesome-icon icon="trash-can" aria-hidden="true" />
            <span class="sr-only">删除课程</span>
          </span>
        </button>
      </div>
      <div class="course-body" v-show="showCourseBox[cidx]">
        <div class="row">
          <label :for="`input-title-${cidx}`">名称</label>
          <input :id="`input-title-${cidx}`" v-model="course.title" />
          <label :for="`input-instructor-${cidx}`">教师</label>
          <input :id="`input-instructor-${cidx}`" v-model="course.instructor" />
        </div>

        <div class="row">
          <label>学期</label>
          <div class="quarters-combo">
            <BaseCheckboxCombo :labels="quarters.map((q) => q.name)" :selected="course.quarters" />
          </div>
        </div>

        <!-- sessions -->
        <div
          v-for="(session, sidx) in course.sessions"
          class="session-box"
          @click.stop="onClickSession(course, session)"
          :class="{ selected: isSelected(session) }"
        >
          <div class="session-header">
            <h3>课时 #{{ sidx + 1 }}</h3>
            <button @click.stop="deleteSession(sidx, cidx)">
              <span v-if="confirmingDelete(cidx, 'session', sidx)">确定</span>
              <span v-else>
                <font-awesome-icon icon="trash-can" aria-hidden="true" />
                <span class="sr-only">删除</span>
              </span>
            </button>
          </div>

          <div class="row">
            <label>时间</label>
            <select v-model="session.weekday">
              <option v-for="weekday in weekdays" :value="weekday.value">
                {{ weekday.text }}
              </option>
            </select>
            <input type="number" name="start" v-model.number="session.start" />
            <span>-</span>
            <input type="number" name="end" v-model.number="session.end" />
            <span>节</span>
          </div>

          <div class="row">
            <label>频次</label>
            <BaseRadioCombo
              :labels="frequencyOptions"
              v-model.number="session.freq.type"
              @update:modelValue="onChangeFreqType($event, session)"
            ></BaseRadioCombo>
          </div>

          <div v-if="session.freq.type === 3" class="frequency">
            <!-- 自定义 -->
            <template v-for="(quarter, qidx) in quarters" :key="quarter.name">
              <div class="row" v-if="course.quarters.includes(qidx)">
                <span :for="`input-custom-freq-${qidx}-${sidx}-${cidx}`">{{ quarter.name }}</span>
                <input
                  :id="`input-custom-freq-${qidx}-${sidx}-${cidx}`"
                  v-model="session.freq.detail[qidx]"
                  :placeholder="!qidx ? '例：1,4,5,8' : ''"
                />
                <span>周</span>
              </div>
            </template>
          </div>

          <div class="row">
            <label :for="`input-location-${sidx}-${cidx}`">地点</label>
            <input :id="`input-location-${sidx}-${cidx}`" v-model="session.location" />
          </div>

          <div class="row">
            <label :for="`input-note-${sidx}-${cidx}`">备注</label>
            <input :id="`input-note-${sidx}-${cidx}`" v-model="session.note" />
          </div>
        </div>

        <!-- exams -->
        <div v-for="(exam, eidx) in course.exams" :key="eidx" class="session-box">
          <div class="session-header">
            <h3>考试 {{ eidx + 1 }}</h3>
            <button @click.stop="deleteExam(eidx, cidx)">
              <span v-if="confirmingDelete(cidx, 'exam', eidx)">确定</span>
              <span v-else>
                <font-awesome-icon icon="trash-can" aria-hidden="true" />
                <span class="sr-only">删除</span>
              </span>
            </button>
          </div>

          <div class="row">
            <label :for="`input-exam-date-${eidx}-${cidx}`">日期</label>
            <input type="date" :id="`input-exam-date-${eidx}-${cidx}`" v-model="exam.date" />
            <label>时间</label>
            <input type="time" v-model="exam.start" style="flex: 0.5" />
            <span>-</span>
            <input type="time" v-model="exam.end" style="flex: 0.5" />
          </div>

          <div class="row">
            <label>地点</label>
            <input v-model="exam.location" />
          </div>
        </div>

        <div class="row">
          <button @click="addSession(course)">
            <font-awesome-icon icon="circle-plus" aria-hidden="true" fixed-width />添加课时
          </button>
          <button @click="addExam(course)">
            <font-awesome-icon icon="circle-plus" aria-hidden="true" fixed-width />添加考试
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapState, mapStores } from 'pinia'
import { useScheduleStore } from '../stores/schedule'
import { useSemesterStore } from '../stores/semester'
import BaseCheckboxCombo from './BaseCheckboxCombo.vue'
import BaseRadioCombo from './BaseRadioCombo.vue'

export default defineComponent({
  data: () => ({
    weekdays: [
      { text: '周一', value: 1 },
      { text: '周二', value: 2 },
      { text: '周三', value: 3 },
      { text: '周四', value: 4 },
      { text: '周五', value: 5 },
      { text: '周六', value: 6 },
      { text: '周日', value: 7 },
      // { text: '指定日期', value: 8 },
    ],

    frequencyOptions: ['所有周', '单周', '双周', '自定义'],

    // [course index, 'session' | 'exam' | null, session/exam index]
    confirmDeleteRecord: [-1, null, -1],
  }),
  computed: {
    ...mapStores(useScheduleStore),
    ...mapState(useScheduleStore, {
      course: 'selectedCourse',
      courses: 'courses',
      showCourseBox: 'showCourseBox',
    }),
    ...mapState(useSemesterStore, ['quarters', 'timeslots']),
  },
  methods: {
    isSelected(courseOrSession) {
      return (
        this.scheduleStore.selectedCourse === courseOrSession ||
        this.scheduleStore.selectedSession === courseOrSession
      )
    },

    addSession(course) {
      this.scheduleStore.addSessionToCourse(course)
    },
    addExam(course) {
      this.scheduleStore.addExamToCourse(course)
    },
    deleteSession(sessionIndex, courseIndex) {
      if (this.confirmingDelete(courseIndex, 'session', sessionIndex)) {
        let course = this.courses[courseIndex]
        let session = course.sessions[sessionIndex]
        this.scheduleStore.deleteSessionFromCourse(session, course)
        this.confirmDelete()
      } else {
        this.confirmDelete(courseIndex, 'session', sessionIndex)
      }
    },
    addCourse() {
      const newCourse = this.scheduleStore.addCourse()

      let cidx = this.courses.indexOf(newCourse)
      console.log(cidx)
      this.showCourseBox[cidx] = true
      this.$nextTick(() => {
        document.getElementById(`course-${cidx}`).scrollIntoView()
      })
    },
    deleteCourse(courseIndex) {
      if (this.confirmingDelete(courseIndex, null, -1)) {
        this.scheduleStore.deleteCourse(this.courses[courseIndex])
        this.confirmDelete()
      } else {
        this.confirmDelete(courseIndex, null, -1)
      }
    },
    deleteExam(examIndex, courseIndex) {
      if (this.confirmingDelete(courseIndex, 'exam', examIndex)) {
        let course = this.courses[courseIndex]
        let exam = course.exams[examIndex]
        this.scheduleStore.deleteExamFromCourse(exam, course)
        this.confirmDelete()
      } else {
        this.confirmDelete(courseIndex, 'exam', examIndex)
      }
    },

    onChangeFreqType(newType, session) {
      if (newType === 3) {
        if (!session.freq.detail) session.freq.detail = new Array(this.quarters.length)
      }
    },

    select(course, session) {
      this.scheduleStore.select(course, session)
    },

    confirmDelete(courseIndex, type, sessionOrExamIndex) {
      this.confirmDeleteRecord[0] = courseIndex
      this.confirmDeleteRecord[1] = type
      this.confirmDeleteRecord[2] = sessionOrExamIndex
    },

    confirmingDelete(courseIndex = -1, type = null, sessionOrExamIndex = -1) {
      return (
        this.confirmDeleteRecord[0] === courseIndex &&
        this.confirmDeleteRecord[1] === type &&
        this.confirmDeleteRecord[2] === sessionOrExamIndex
      )
    },

    onClickForm() {
      this.select(null, null)
      this.confirmDelete()
    },

    onClickCourse(course) {
      this.select(course, null)
      this.confirmDelete()
    },

    onClickSession(course, session) {
      this.select(course, session)
      this.confirmDelete()
    },
  },
  components: { BaseCheckboxCombo, BaseRadioCombo },
})
</script>

<style scoped>
#edit-form {
  margin-bottom: 0.9rem;
}

.course-header {
  display: flex;
  justify-content: left;
  align-items: center;
  background-color: rgb(231, 231, 231);
  margin: 5px 0;
  padding: 5px 10px;
  gap: 0.25rem;
}

.course-header > *:first-child {
  margin: 0;
  padding: 0;
  width: 1rem;
}

.course-header h2 {
  font-size: 1.1em;
  margin: 0;
  padding: 0;
}

.course-header > *:last-child {
  margin-left: auto;
}

.course-body {
  margin-bottom: 20px;
}
.course.selected > .course-header {
  background-color: royalblue;
  color: white;
}

.course.selected > .course-header > button {
  color: rgb(197, 241, 255);
}

.session-box {
  background-color: rgb(248, 248, 248);
  padding: 10px;
}

.session-box.selected {
  background-color: rgb(197, 241, 255);
}

.session-box + .session-box {
  margin-top: 10px;
}

.session-header {
  display: flex;
  margin: 0 0 5px 0;
  gap: 0.5rem;
}

.session-header h3 {
  font-size: 1rem;
  margin: 0;
  padding: 0;
}

.session-header > *:last-child {
  margin-left: auto;
}

.frequency {
  margin-left: 2.5rem;
}

.row {
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 0.5rem;
  margin: 5px 0;
}

input,
select {
  flex: 1;
  width: 100%;
}

/* labels are fixed-width */
label {
  flex-basis: 2rem;
}

/* button */
button {
  background-color: transparent;
  border: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  color: rgb(3, 89, 160);
}
</style>
