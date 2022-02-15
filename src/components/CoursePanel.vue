<template>
  <div style="border: 1px solid black">Hello</div>
</template>

<script lang="ts">
import { useTimetableStore } from '../stores/timetable'
import { useScheduleStore } from '../stores/schedule'

export default {
  setup() {
    const timetableStore = useTimetableStore()
    const scheduleStore = useScheduleStore()
    return { timetableStore, scheduleStore }
  },
}
</script>

<style scoped></style>
