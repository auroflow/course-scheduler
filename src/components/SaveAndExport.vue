<template>
  <div class="container">
    <ol class="edit-nav">
      <li class="disabled">编辑校历</li>
      <li class="disabled">编辑课表</li>
      <li>保存和导出</li>
    </ol>

    <div class="buttons">
      <button class="button" @click="exportCalendar">导出</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { defineComponent } from 'vue'
import { useScheduleStore } from '../stores/schedule'
import { useSemesterStore } from '../stores/semester'
import { generateCalendar } from '../js/converter'

export default defineComponent({
  computed: {
    ...mapState(useSemesterStore, ['quarters', 'timeslots']),
    ...mapState(useScheduleStore, ['courses']),
  },
  methods: {
    exportCalendar(e) {
      generateCalendar(this.quarters, this.timeslots, this.courses)
    },
  },
})
</script>

<style scoped></style>
