<template>
  <div class="form">
    <template v-if="course">
      <div>
        <div class="row">
          <label class="col-label" for="title">课程名</label>
          <input
            class="col-input"
            id="title"
            name="title"
            v-model="course.title"
          />
        </div>
        <div class="row">
          <label class="col-label" for="instructor">教师</label>
          <input
            class="col-input"
            id="instructor"
            name="instructor"
            v-model="course.instructor"
          />
        </div>
        <div class="row">
          <label class="col-label">学期</label>
          <div class="col-input">
            <input name="quarter-start" v-model.number="course.quarterStart" />
            <label class="text-in-form" for="quarter-end">-</label>
            <input name="quarter-end" v-model.number="course.quarterEnd" />
          </div>
        </div>
      </div>
      <details
        v-for="(section, index) in course.sections"
        :key="index"
        class="section-box"
        open
      >
        <summary class="title">
          课时 {{ index + 1 }}
          <button @click="deleteSection(section)" class="section-delete">
            删除
          </button>
        </summary>
        <div class="row">
          <label class="col-label">时间</label>
          <div class="col-input">
            <select v-model="section.weekday">
              <option v-for="weekday in weekdays" :value="weekday.value">
                {{ weekday.text }}
              </option>
            </select>
            <label class="text-in-form"></label>
            <input name="start" v-model.number="section.start" />
            <label class="text-in-form">-</label>
            <input name="end" v-model.number="section.end" />
            <label class="text-in-form">节</label>
          </div>
        </div>
        <div class="row">
          <label class="col-label">地点</label>
          <div class="col-input">
            <input name="location" v-model="section.location" />
          </div>
        </div>
        <div class="row">
          <label class="col-label">备注</label>
          <div class="col-input">
            <input name="location" v-model="course.sections[index].note" />
          </div>
        </div>
      </details>
    </template>

    <!-- buttons -->
    <button v-if="!course" class="btn" @click="addCourse">添加新课程</button>
    <template v-else>
      <button class="btn" @click="addSection">添加课时</button>
      <button class="btn float-right" @click="deleteCourse">删除课程</button>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SectionOnEdit } from '../types'
import { useScheduleStore } from '../stores/schedule'
import { mapStores, mapState } from 'pinia'

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
    }),
  },

  methods: {
    addSection() {
      this.course?.sections.push({
        weekday: null,
        start: null,
        end: null,
        location: '',
        note: '',
      })
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
  },
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.form {
  font-size: 14px;
}

input,
select {
  display: inline-block;
  width: 100%;
  padding: 8px;
}

label {
  padding: 8px;
}

.row {
  display: flex;
  margin: 5px;
}

.col-label {
  flex: 0 0 70px;
}

.col-input {
  flex: 1;
}

div.col-input {
  display: flex;
}

div.col-input > input,
div.col-input > select {
  flex: 1;
}

div.col-input > .text-in-form {
  flex: 0 0 20px;
  text-align: center;
  padding: 8px 0;
}

/* 课时框 */
.section-box {
  margin-bottom: 5px;
  border: 1px solid grey;
  padding: 10px;
}

.section-box > .row {
  margin-left: 20px;
}

.btn {
  background-color: green;
  color: white;
  margin: 10px;
  padding: 8px 14px;
  min-width: 100px;
  border: none;
}

.section-delete {
  font-size: 12px;
  background-color: transparent;
  border: none;
  float: right;
}

.float-right {
  float: right;
  margin-right: 0;
}
</style>
