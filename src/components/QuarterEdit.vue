<template>
  <div class="form">
    <div class="title">学期</div>
    <template v-for="(quarter, qidx) in quarters" :key="qidx">
      <div class="row">
        <label class="text-in-form">学期名</label>
        <input v-model="quarter.name" style="flex: 0.5" />
        <label class="text-in-form">开始于</label>
        <input type="date" v-model="quarter.start" />
        <label class="text-in-form">结束于</label>
        <input type="date" v-model="quarter.end" />
        <button @click="deleteQuarter(quarter)" class="delete-btn">删除</button>
      </div>
    </template>
    <button class="btn" @click="addQuarter">添加新学期</button>

    <div class="title">时间表</div>
    <div v-for="(timeslot, index) in timeslots" :key="index" class="row">
      <label class="col-label">第 {{ index + 1 }} 节</label>
      <input
        v-model="timeslot.startTime"
        type="time"
        @blur="sortTimeslots(timeslot)"
      />
      <label class="text-in-form">-</label>
      <input
        v-model="timeslot.endTime"
        type="time"
        @blur="sortTimeslots(timeslot)"
      />
      <button @click="deleteTimeslot(timeslot)" class="delete-btn">删除</button>
    </div>
    <button class="btn" @click="addTimeslot">添加课时</button>
  </div>
</template>

<script lang="ts">
import { useTimetableStore } from '../stores/timetable'
import { useSemesterStore } from '../stores/semester'
import { defineComponent } from 'vue'
import { mapState, mapStores } from 'pinia'
import { Quarter, Timeslot } from '../types'

export default defineComponent({
  computed: {
    ...mapStores(useSemesterStore, useTimetableStore),
    ...mapState(useSemesterStore, ['quarters']),
    ...mapState(useTimetableStore, ['timeslots']),
  },

  methods: {
    addQuarter() {
      this.semesterStore.addQuarter()
    },

    deleteQuarter(quarter: Quarter) {
      this.semesterStore.deleteQuarter(quarter)
    },

    addTimeslot() {
      this.timetableStore.addTimeslot()
    },

    deleteTimeslot(timeslot: Timeslot) {
      this.timetableStore.deleteTimeslot(timeslot)
    },

    sortTimeslots(timeslot: Timeslot | null) {
      if (timeslot?.startTime && timeslot?.endTime) this.timetableStore.sort()
    },
  },
})
</script>

<style scoped src="../css/form.css"></style>
