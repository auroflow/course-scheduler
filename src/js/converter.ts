import { Schedule, Semester, Timetable } from '../types'
import { ics } from './ics'
import { DateTime } from 'luxon'

// Generate
export function generateCalendar(
  semester: Semester,
  timeslots: Timetable,
  schedule: Schedule
) {
  const cal = ics()
  if (!cal) return

  for (let course of schedule) {
    const firstDay = DateTime.fromISO(semester[course.quarterStart].start)
    const lastDay = DateTime.fromISO(semester[course.quarterEnd].end).endOf(
      'day'
    )

    for (let section of course.sections) {
      // 得到课时第一天与学期第一天的差值
      let delta = section.weekday - firstDay.weekday
      if (delta < 0) delta += 7

      const day = firstDay.plus({ day: delta })
      // [hh, mm]
      const startTime = timeslots[section.start - 1].startTime.split(':')
      const endTime = timeslots[section.end - 1].endTime.split(':')

      const start = day.plus({
        hour: parseInt(startTime[0]),
        minute: parseInt(startTime[1]),
      })
      const end = day.plus({
        hour: parseInt(endTime[0]),
        minute: parseInt(endTime[1]),
      })

      cal.addEvent(
        course.title,
        course.instructor,
        section.location,
        start.toISO(),
        end.toISO(),
        {
          freq: 'WEEKLY',
          until: lastDay.toISO(),
        }
      )
    }
  }

  console.log(cal.build())
  cal.download('calendar', '.ics')
}
