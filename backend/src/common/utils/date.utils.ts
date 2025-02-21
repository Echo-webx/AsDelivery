import { EnumSalaryWeekday } from '@prisma/client'
import {
	addDays,
	eachWeekOfInterval,
	endOfMonth,
	format,
	startOfMonth,
	startOfWeek
} from 'date-fns'

export function getWeeksInMonth(week: string) {
	const [year, weekNum] = week.split('-W').map(part => parseInt(part, 10))
	const startOfGivenWeek = startOfWeek(new Date(year, 0, weekNum * 7), {
		weekStartsOn: 1
	})
	const month = startOfGivenWeek.getMonth()

	const start = startOfMonth(new Date(year, month))
	const end = endOfMonth(new Date(year, month))

	return eachWeekOfInterval({ start, end }).map(weekStart =>
		format(weekStart, "yyyy-'W'ww")
	)
}

export function getMonthInWeekDate(week: string, weekday: EnumSalaryWeekday) {
	const [year, weekNumber] = week.split('-W').map(Number)
	const weekdayIndex = Object.values(EnumSalaryWeekday).indexOf(weekday)

	const startOfSpecifiedWeek = startOfWeek(
		new Date(year, 0, 1 + (weekNumber - 1) * 7),
		{ weekStartsOn: 1 }
	)

	const date = addDays(startOfSpecifiedWeek, weekdayIndex)
	return format(date, "yyyy-'M'MM")
}
