<template>
  <div class="form">
    <template v-if="course">
      <div>
        <div class="row">
          <div class="col">
            <label class="col-label" for="title">课程名</label>
            <input class="col" id="title" name="title" v-model="course.title" />
          </div>
          <div class="col">
            <label class="col-label" for="instructor">教师</label>
            <input
              class="col"
              id="instructor"
              name="instructor"
              v-model="course.instructor"
            />
          </div>
        </div>

        <div class="row">
          <label class="col-label">学期</label>
          <div class="col">
            <select v-model="course.quarterStart">
              <option v-for="(quarter, index) in quarters" :value="index">
                {{ quarter.name }}
              </option>
            </select>
            <label class="text-in-form" for="quarter-end">-</label>
            <select v-model="course.quarterEnd">
              <option v-for="(quarter, index) in quarters" :value="index">
                {{ quarter.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 课时 -->
      <details
        v-for="(section, index) in course.sections"
        :key="index"
        class="section-box"
        :class="{
          selected: isSelected(section),
        }"
        open
      >
        <summary>
          课时 {{ index + 1 }}
          <button @click="deleteSection(section)" class="delete-btn">
            删除
          </button>
        </summary>
        <div class="row">
          <label class="col-label">时间</label>
          <div class="col">
            <select v-model="section.weekday">
              <option v-for="weekday in weekdays" :value="weekday.value">
                {{ weekday.text }}
              </option>
            </select>
            <label class="text-in-form"></label>
            <input type="number" name="start" v-model.number="section.start" />
            <label class="text-in-form">-</label>
            <input type="number" name="end" v-model.number="section.end" />
            <label class="text-in-form">节</label>
          </div>
        </div>
        <div class="row">
          <label class="col-label">地点</label>
          <div class="col">
            <input name="location" v-model="section.location" />
          </div>
        </div>
        <div class="row">
          <label class="col-label">备注</label>
          <div class="col">
            <input name="location" v-model="course.sections[index].note" />
          </div>
        </div>
      </details>

      <!-- 考试 -->
      <details
        v-for="(exam, index) in course.exams"
        :key="index"
        class="section-box"
        open
      >
        <summary>
          考试 {{ index + 1 }}
          <button @click="deleteExam(exam)" class="delete-btn">删除</button>
        </summary>
        <div class="row">
          <label class="col-label">时间</label>
          <div class="col">
            <input type="datetime-local" v-model="exam.start" />
            <label class="text-in-form">-</label>
            <input type="datetime-local" v-model="exam.end" />
          </div>
        </div>
        <div class="row">
          <label class="col-label">地点</label>
          <div class="col">
            <input v-model="exam.location" />
          </div>
        </div>
      </details>

      <!-- buttons -->
      <button class="btn" @click="addSection">添加课时</button>
      <button class="btn" @click="addExam">添加考试</button>
      <button class="btn float-right" @click="deleteCourse">删除课程</button>
    </template>

    <!-- No course selected -->
    <template v-else>
      <div class="row">左侧课表中选择课程</div>
      <button class="btn" @click="addCourse">添加新课程</button>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Exam, Schedule, SectionOnEdit } from '../types'
import { useScheduleStore } from '../stores/schedule'
import { mapStores, mapState } from 'pinia'
import { useSemesterStore } from '../stores/semester'
import { useTimetableStore } from '../stores/timetable'

export default defineComponent({
  data() {
    return {
      weekdays: [
        {
          text: '周一',
          value: 1,
        },
        {
          text: '周二',
          value: 2,
        },
        {
          text: '周三',
          value: 3,
        },
        {
          text: '周四',
          value: 4,
        },
        {
          text: '周五',
          value: 5,
        },
        {
          text: '周六',
          value: 6,
        },
        {
          text: '周日',
          value: 7,
        },
      ],
    }
  },

  computed: {
    ...mapStores(useScheduleStore),
    ...mapState(useScheduleStore, {
      course: 'selectedCourse',
      courses: 'courses',
    }),
    ...mapState(useSemesterStore, ['quarters']),
    ...mapState(useTimetableStore, ['timeslots']),
  },

  methods: {
    isSelected(section: SectionOnEdit) {
      return this.scheduleStore.selectedSection === section
    },

    addSection() {
      this.scheduleStore.addSectionToSelectedCourse()
    },

    addExam() {
      this.scheduleStore.addExamToSelectedCourse()
    },

    deleteSection(section: SectionOnEdit) {
      this.scheduleStore.deleteSectionFromSelectedCourse(section)
    },

    addCourse() {
      this.scheduleStore.addCourse()
    },

    deleteCourse() {
      this.scheduleStore.deleteSelectedCourse()
    },

    deleteExam(exam: Exam) {
      this.scheduleStore.deleteExamFromSelectedCourse(exam)
    },
  },
})
</script>

<style scoped src="../css/form.css"></style>
