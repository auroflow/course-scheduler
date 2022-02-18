<template>
  <div id="navbar">
    编辑课表
    <div class="spacer"></div>
    <button @click="$emit('my-reset')">样例课表</button>
    <button @click="$emit('clear')">清空课表</button>
    <button @click="generateSchedule">生成日历文件</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'pinia'
import { Schedule } from '../types'
import { generateCalendar } from '../js/converter'
import { useTimetableStore } from '../stores/timetable'
import { useSemesterStore } from '../stores/semester'
import { useScheduleStore } from '../stores/schedule'

export default defineComponent({
  computed: {
    ...mapState(useScheduleStore, ['courses']),
    ...mapState(useTimetableStore, ['timeslots']),
    ...mapState(useSemesterStore, ['quarters']),
  },

  methods: {
    generateSchedule() {
      generateCalendar(this.quarters, this.timeslots, this.courses as Schedule)
    },
  },
})
</script>

<style scoped>
#navbar {
  display: flex;
  position: relative;
  width: 100%;
  padding: 13px;
  font-size: 20px;
  background-color: gainsboro;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.spacer {
  flex-grow: 1;
}

button {
  border: none;
  background-color: transparent;
  color: darkslategrey;
}

button:hover {
  color: darkgrey;
}
</style>
