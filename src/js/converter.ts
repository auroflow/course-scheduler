import { Schedule, Semester, Timetable } from '../types'
import { ics } from './ics'
import { DateTime } from 'luxon'

// Generate
export function generateCalendar(quarters: Semester, timeslots: Timetable, courses: Schedule) {
  const cal = ics()
  if (!cal) return

  for (let [qidx, quarter] of quarters.entries()) {
    const firstDay = DateTime.fromISO(quarter.start)
    const lastDay = DateTime.fromISO(quarter.end).endOf('day')

    // for each course in this semester
    for (let course of courses) {
      if (!course.quarters.includes(qidx)) continue

      for (let session of course.sessions) {
        // 得到课时第一天与学期第一天的差值
        let delta = session.weekday - firstDay.weekday
        if (delta < 0) delta += 7

        let firstClassDay = firstDay.plus({ day: delta })
        let start = timeslots[session.start - 1].startTime.split(':')
        let end = timeslots[session.end - 1].endTime.split(':')
        let firstClassStart = firstClassDay.plus({
          hour: parseInt(start[0]),
          minute: parseInt(start[1]),
        })
        let firstClassEnd = firstClassDay.plus({
          hour: parseInt(end[0]),
          minute: parseInt(end[1]),
        })

        let description = ''
        if (session.note) {
          description += session.note += '\n\n'
        }
        description += '教师：' + course.instructor

        if (session.freq.type === 0) {
          // weekly
          cal.addEvent(
            course.title,
            description,
            session.location,
            firstClassStart.toISO(),
            firstClassEnd.toISO(),
            {
              freq: 'WEEKLY',
              until: lastDay.toISO(),
            }
          )
        } else if (session.freq.type === 1) {
          // odd weeks
          cal.addEvent(
            course.title,
            description,
            session.location,
            firstClassStart.toISO(),
            firstClassEnd.toISO(),
            {
              freq: 'WEEKLY',
              until: lastDay.toISO(),
              interval: 2,
            }
          )
        } else if (session.freq.type === 2) {
          // even weeks
          cal.addEvent(
            course.title,
            description,
            session.location,
            firstClassStart.plus({ week: 1 }).toISO(),
            firstClassEnd.plus({ week: 1 }).toISO(),
            {
              freq: 'WEEKLY',
              until: lastDay.toISO(),
              interval: 2,
            }
          )
        } else if (session.freq.type === 3) {
          // customized
          for (let week of session.freq.detail[qidx].split(',')) {
            let widx = parseInt(week)
            cal.addEvent(
              course.title,
              description,
              session.location,
              firstClassStart.plus({ week: widx - 1 }).toISO(),
              firstClassEnd.plus({ week: widx - 1 }).toISO(),
              null
            )
          }
        }
      }
    }
  }

  // Add exams
  for (let course of courses) {
    for (let exam of course.exams) {
      let date = DateTime.fromISO(exam.date)
      let start = exam.start.split(':').map((str) => parseInt(str))
      let end = exam.end.split(':').map((str) => parseInt(str))

      console.log(course.title, start.toLocaleString(), end.toLocaleString())

      cal.addEvent(
        '【考试】' + course.title,
        course.instructor,
        exam.location,
        date.plus({ hour: start[0], minute: start[1] }).toISO(),
        date.plus({ hour: start[0], minute: start[1] }).toISO(),
        null
      )
    }
  }

  console.log(cal.build())
  cal.download('calendar', '.ics')
}
