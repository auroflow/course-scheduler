import { defineStore } from 'pinia'
import { Timeslot } from '../types'

export const useTimetableStore = defineStore('timetable', {
  state: () => ({
    timeslots: [
      {
        startTime: '08:00',
        endTime: '08:45',
      },
      {
        startTime: '08:50',
        endTime: '09:35',
      },
      {
        startTime: '09:50',
        endTime: '10:35',
      },
      {
        startTime: '10:40',
        endTime: '11:25',
      },
      {
        startTime: '11:30',
        endTime: '12:15',
      },
      {
        startTime: '13:15',
        endTime: '14:00',
      },
      {
        startTime: '14:05',
        endTime: '14:50',
      },
      {
        startTime: '14:55',
        endTime: '15:40',
      },
      {
        startTime: '15:55',
        endTime: '16:40',
      },
      {
        startTime: '16:45',
        endTime: '17:30',
      },
      {
        startTime: '18:30',
        endTime: '19:15',
      },
      {
        startTime: '19:20',
        endTime: '20:05',
      },
      {
        startTime: '20:10',
        endTime: '20:55',
      },
    ],
  }),

  actions: {
    addTimeslot() {
      this.timeslots.push({
        startTime: '',
        endTime: '',
      })
    },

    deleteTimeslot(timeslot: Timeslot) {
      this.timeslots = this.timeslots.filter((t) => t !== timeslot)
    },

    sort() {
      this.timeslots.sort((a, b) =>
        a.startTime < b.startTime ? -1 : a.startTime === b.startTime ? 0 : 1
      )
    },
  },
})
