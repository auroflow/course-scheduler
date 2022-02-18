import { defineStore } from 'pinia'
import { Quarter, Semester } from '../types'

export const useSemesterStore = defineStore('semester', {
  state: () => ({
    quarters: [
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
    ] as Semester,
  }),

  actions: {
    getNewQuarter() {
      return {
        name: '',
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      }
    },

    addQuarter() {
      this.quarters.push(this.getNewQuarter())
    },

    deleteQuarter(quarter: Quarter) {
      this.quarters = this.quarters.filter((q) => q !== quarter)
    },
  },
})
