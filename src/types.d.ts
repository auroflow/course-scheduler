export interface Timeslot {
  startTime: string
  endTime: string
}

export interface Quarter {
  name: string
  start: string
  end: string
}

interface RegularFrequency {
  type: 0 | 1 | 2
}

interface ManualFrequency {
  type: 3
  detail: string[]
}

export type Frequency = RegularFrequency | ManualFrequency

export interface Session {
  weekday: number
  start: number
  end: number
  location: string
  note: string
  freq: Frequency
}

export interface SessionOnEdit {
  weekday: number | null
  start: number | null
  end: number | null
  location: string
  note: string
  freq: Frequency
}

export interface Exam {
  location: string
  date: string
  start: string
  end: string
}

export interface Course {
  title: string
  instructor: string
  quarters: number[]
  sessions: Session[]
  exams: Exam[]
}

export interface CourseOnEdit {
  title: string
  instructor: string
  quarters: number[]
  sessions: SessionOnEdit[]
  exams: Exam[]
}

export type Semester = Quarter[]
export type Timetable = Timeslot[]
export type Schedule = Course[]
