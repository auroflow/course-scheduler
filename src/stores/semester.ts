import { defineStore } from 'pinia'
import { Quarter } from '../types'

export const useSemesterStore = defineStore('semester', {
  state: () => ({
    quarters: [
      {
        name: '春学期',
        start: new Date(2022, 2, 21),
        end: new Date(2022, 4, 17),
      },
      {
        name: '夏学期',
        start: new Date(2022, 4, 18),
        end: new Date(2022, 6, 12),
      },
    ] as Quarter[],
  }),
})
