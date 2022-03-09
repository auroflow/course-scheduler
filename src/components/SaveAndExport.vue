<template>
  <div class="container">
    <ol class="edit-nav">
      <li class="disabled">
        <router-link :to="{ name: 'edit-semester' }">编辑校历</router-link>
      </li>
      <li class="disabled">
        <router-link :to="{ name: 'edit-schedule' }">编辑课表</router-link>
      </li>
      <li>保存和导出</li>
    </ol>

    <div class="buttons">
      <button class="button" @click="prevStep">上一步</button>
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
    prevStep() {
      this.$router.push({ name: 'edit-schedule' })
    },
    exportCalendar() {
      generateCalendar(this.quarters, this.timeslots, this.courses)
    },
  },
})
</script>

<style scoped></style>
