import { defineStore } from 'pinia'
import { DateTime } from 'luxon'

export const useSemesterStore = defineStore('semester', {
  state: () => ({
    timeslots: [],
    quarters: [],
    initDone: false,
    selected: 0,
  }),

  actions: {
    addTimeslot() {
      this.timeslots.push({
        startTime: '',
        endTime: '',
      })
    },

    deleteTimeslot(timeslot) {
      this.timeslots = this.timeslots.filter((t) => t !== timeslot)
    },

    sortTimeslots() {
      this.timeslots.sort((a, b) =>
        a.startTime < b.startTime ? -1 : a.startTime === b.startTime ? 0 : 1
      )
    },

    selectQuarter(index) {
      this.selected = index
    },

    addQuarter() {
      this.quarters.push({
        name: '新学期',
        start: DateTime.now().startOf('week').plus({ week: 1 }).toFormat('yyyy-LL-dd'),
        end: DateTime.now().startOf('week').plus({ week: 9 }).toFormat('yyyy-LL-dd'),
      })
    },

    deleteQuarter(quarter) {
      if (this.selected === this.quarters.length - 1 && this.selected > 0) this.selected--
      this.quarters = this.quarters.filter((q) => q !== quarter)
    },

    sortQuarters() {
      this.quarters.sort((a, b) => {
        if (a.start < b.start) return -1
        else if (a.start === b.start) return 0
        else return 1
      })
    },

    save() {
      localStorage.setItem('initDone', this.initDone)
      localStorage.setItem('semester', JSON.stringify(this.quarters))
      localStorage.setItem('timetable', JSON.stringify(this.timeslots))
    },

    load() {
      let initDone = localStorage.getItem('initDone')
      if (initDone === null) {
        initDone = false
      } else {
        initDone = JSON.parse(initDone)
      }
      this.initDone = initDone

      let quarters = localStorage.getItem('semester')
      if (quarters) {
        this.quarters = JSON.parse(quarters)
      }

      let timetable = localStorage.getItem('timetable')
      if (timetable) {
        this.timeslots = JSON.parse(timetable)
      }
    },

    clear() {
      this.$reset()
    },

    reset() {
      this.timeslots = [
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
      ]
      this.quarters = [
        {
          name: '春学期',
          start: '2022-02-21',
          end: '2022-04-17',
        },
        {
          name: '夏学期',
          start: '2022-04-18',
          end: '2022-06-12',
        },
      ]
      this.initDone = true
      this.selected = 0
    },
  },
})
