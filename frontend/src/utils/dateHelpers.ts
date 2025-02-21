import dayjs from 'dayjs'

export function formatDayJs(
	type: 'standard' | 'D_MMMM_YYYY' | 'D_MMMM_YYYY, HH:mm',
	data?: any,
	notFound?: string
) {
	const standard = notFound || 'Дата не указана'
	if (type === 'D_MMMM_YYYY')
		return data ? dayjs(data).format('D MMMM YYYY') : standard
	if (type === 'D_MMMM_YYYY, HH:mm')
		return data ? dayjs(data?.createdAt).format('D MMMM YYYY, HH:mm') : standard
	return data ? dayjs(data).fromNow() : standard
}

export function getToday() {
	return dayjs().format('YYYY-MM-DD')
}

export function getCurrentWeek() {
	const year = dayjs().format('YYYY')
	const week = dayjs().isoWeek()
	return `${year}-W${String(week).padStart(2, '0')}`
}
