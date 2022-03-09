<template>
  <nav>
    <ul>
      <li><h1>课表编辑器</h1></li>
      <li>校历广场</li>
      <li>我的课表</li>
      <li>添加课表</li>
    </ul>
  </nav>
</template>

<script>
import { defineComponent } from 'vue'
import { mapState } from 'pinia'

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
      generateCalendar(this.quarters, this.timeslots, this.courses)
    },
  },
})
</script>

<style scoped>
nav {
  max-width: 1280px;
  margin: 0 auto;
  padding: 15px 0;
  font-size: 1.25em;
}
nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
nav h1 {
  font-size: 1.5rem;
  margin: 0;
  padding: 0;
}
nav ul li:first-child {
  flex-basis: auto;
  margin-right: auto;
  text-align: left;
}
@media (max-width: 1280px) {
  nav {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
