import { defineStore } from 'pinia'
import { Course, CourseOnEdit, Exam, Section, SectionOnEdit } from '../types'
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
          { weekday: 1, start: 6, end: 8, location: '曹西-103', note: '' },
          { weekday: 2, start: 3, end: 4, location: '曹西-503', note: '' },
        ],
        exams: [
          { start: '2022-06-21T08:00', end: '2022-06-21T10:00', location: '' },
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
      {
        title: '大规模信息系统构建技术导论',
        instructor: '鲁伟明',
        quarterStart: 0,
        quarterEnd: 0,
        sections: [
          { weekday: 1, start: 3, end: 4, location: '曹西-104', note: '' },
          { weekday: 4, start: 3, end: 4, location: '曹西-104', note: '' },
        ],
        exams: [],
      },
      {
        title: '网络安全原理与实践',
        instructor: '卜凯',
        quarterStart: 0,
        quarterEnd: 0,
        sections: [
          { weekday: 1, start: 9, end: 10, location: '曹西-103', note: '' },
          { weekday: 2, start: 7, end: 8, location: '曹西-503', note: '' },
          { weekday: 2, start: 9, end: 10, location: '曹西-103', note: '' },
        ],
        exams: [
          { start: '2022-04-16T08:00', end: '2022-04-16T10:00', location: '' },
        ],
      },
      {
        title: '网络与通信安全',
        instructor: '谢磊',
        quarterStart: 1,
        quarterEnd: 1,
        sections: [
          { weekday: 1, start: 1, end: 2, location: '教7-104', note: '' },
          { weekday: 3, start: 1, end: 2, location: '教7-104', note: '' },
        ],
        exams: [
          { start: '2022-06-13T14:00', end: '2022-06-13T16:00', location: '' },
        ],
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

    getNewExam(): Exam {
      return {
        start: '',
        end: '',
        location: '',
      }
    },

    addCourse() {
      const newCourse = this.getNewCourse()
      this.courses.push(newCourse)
      this.select(newCourse, null)
    },

    addExamToSelectedCourse() {
      this.selectedCourse?.exams.push(this.getNewExam())
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

    deleteExamFromSelectedCourse(exam: Exam) {
      if (this.selectedCourse) {
        this.selectedCourse.exams = this.selectedCourse.exams.filter(
          (e) => e !== exam
        )
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

    save() {
      localStorage.setItem('schedule', JSON.stringify(this.courses))
    },

    load() {
      const item = localStorage.getItem('schedule')
      if (item) {
        this.courses = JSON.parse(item)
      }
    },

    clear() {
      this.courses = []
    },
  },
})
