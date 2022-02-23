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

    selected: 0,
  }),

  actions: {
    selectQuarter(index: number) {
      this.selected = index
    },

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
      if (this.selected === this.quarters.length - 1 && this.selected > 0)
        this.selected--
      this.quarters = this.quarters.filter((q) => q !== quarter)
    },

    save() {
      localStorage.setItem('semester', JSON.stringify(this.quarters))
    },

    load() {
      const item = localStorage.getItem('semester')
      if (item) {
        this.quarters = JSON.parse(item)
      }
    },

    clear() {
      this.$reset()
    },
  },
})
