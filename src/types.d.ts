export interface Timeslot {
  startTime: string
  endTime: string
}

export interface Quarter {
  name: string
  start: string
  end: string
}

export interface Section {
  weekday: number
  start: number
  end: number
  location: string
  note: string
}

export interface SectionOnEdit {
  weekday: number | null
  start: number | null
  end: number | null
  location: string
  note: string
}

export interface Exam {
  location: string
  start: Date
  end: Date
}

export interface ExamOnEdit {
  location: string
  start: Date | null
  end: Date | null
}

export interface Course {
  title: string
  instructor: string
  quarterStart: number // 起始短学期，从0计数
  quarterEnd: number // 终止短学期，从0计数
  sections: Section[]
  exams: Exam[]
}

export interface CourseOnEdit {
  title: string
  instructor: string
  quarterStart: number | null // 起始短学期，从0计数
  quarterEnd: number | null // 终止短学期，从0计数
  sections: SectionOnEdit[]
  exams: ExamOnEdit[]
}

export type Semester = Quarter[]
export type Timetable = Timeslot[]
export type Schedule = Course[]
