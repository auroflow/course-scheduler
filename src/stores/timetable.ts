import { defineStore } from 'pinia'

export const useTimetableStore = defineStore('timetable', {
  state: () => ({
    timeslots: [
      {
        startTime: [8, 0],
        endTime: [8, 45],
      },
      {
        startTime: [8, 50],
        endTime: [9, 35],
      },
      {
        startTime: [9, 50],
        endTime: [10, 35],
      },
      {
        startTime: [10, 40],
        endTime: [11, 25],
      },
      {
        startTime: [11, 30],
        endTime: [12, 15],
      },
      {
        startTime: [13, 15],
        endTime: [14, 0],
      },
      {
        startTime: [14, 5],
        endTime: [14, 50],
      },
      {
        startTime: [14, 55],
        endTime: [15, 40],
      },
      {
        startTime: [15, 55],
        endTime: [16, 40],
      },
      {
        startTime: [16, 45],
        endTime: [17, 30],
      },
      {
        startTime: [18, 30],
        endTime: [19, 15],
      },
      {
        startTime: [19, 20],
        endTime: [20, 5],
      },
      {
        startTime: [20, 10],
        endTime: [20, 55],
      },
    ],
  }),
})
