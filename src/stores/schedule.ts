import { defineStore } from 'pinia'
import { Course, CourseOnEdit, Section, SectionOnEdit } from '../types'
import { useSemesterStore } from './semester'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    courses: [
      {
        title: '编译原理',
        instructor: '冯雁 陈纯',
        quarterStart: 0,
        quarterEnd: 1,
        sections: [
          {
            weekday: 1,
            start: 6,
            end: 8,
            location: '曹西-103',
            note: '',
          },
          {
            weekday: 2,
            start: 3,
            end: 4,
            location: '曹西-503',
            note: '',
          },
        ],
        exams: [
          {
            start: new Date(2022, 6, 21, 8, 0),
            end: new Date(2022, 6, 21, 10, 0),
            location: '待定',
          },
        ],
      },
      {
        title: '乒乓球(初级班)',
        instructor: '朱国华',
        quarterStart: 0,
        quarterEnd: 1,
        sections: [
          {
            weekday: 2,
            start: 1,
            end: 2,
            location: '新桥门乒乓球房',
            note: '',
          },
        ],
        exams: [],
      },
    ] as CourseOnEdit[],

    selectedCourse: null as CourseOnEdit | null,
    selectedSection: null as SectionOnEdit | null,
  }),

  actions: {
    getNewCourse(): CourseOnEdit {
      const semesterStore = useSemesterStore()
      return {
        title: '',
        instructor: '',
        quarterStart: 0,
        quarterEnd: semesterStore.quarters?.length - 1,
        sections: [],
        exams: [],
      }
    },

    getNewSection(): SectionOnEdit {
      return {
        weekday: null,
        start: null,
        end: null,
        location: '',
        note: '',
      }
    },

    addCourse() {
      const newCourse = this.getNewCourse()
      this.courses.push(newCourse)
      this.select(newCourse, null)
    },

    deleteSectionFromSelectedCourse(section: SectionOnEdit) {
      if (this.selectedCourse) {
        this.selectedCourse.sections = this.selectedCourse.sections.filter(
          (s) => s !== section
        )
        if (this.selectedSection === section) {
          this.selectedSection = null
        }
      }
    },

    deleteSelectedCourse() {
      if (this.selectedCourse) {
        this.courses = this.courses.filter((c) => c !== this.selectedCourse)
        this.selectedCourse = null
        this.selectedSection = null
      }
    },

    isDisplayed(course: CourseOnEdit) {
      for (const section of course.sections) {
        if (section.start && section.end && section.weekday) {
          return true
        }
      }
      return false
    },

    select(course: CourseOnEdit | null, section: SectionOnEdit | null) {
      // Delete the previously selected course if it has no sections,
      // because we wouldn't be able to find it on the calendar

      if (this.selectedCourse && !this.isDisplayed(this.selectedCourse)) {
        this.deleteSelectedCourse()
      }

      this.selectedCourse = course
      this.selectedSection = section
    },
  },
})
