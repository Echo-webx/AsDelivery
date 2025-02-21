import { errorCatch, errorStatus } from '@/api/error'

export function errorMessage(err: any, toast: any) {
	if (errorCatch(err) === 'Name is not unique') {
		toast.error('Не уникальное название!')
	} else if (errorCatch(err) === 'The negative limit has been exceeded') {
		toast.error('Превышен отрицательный лимит!')
	} else if (errorCatch(err) === 'Outside of working hours') {
		toast.error('Сейчас не рабочее время!')
	} else if (
		errorCatch(err) === 'Update is allowed only within 1 day of creation'
	) {
		toast.error('Срок редактирования вышел!')
	} else if (errorStatus(err) === '404') {
		toast.error('Неверный данные!')
	} else {
		toast.error('Произошла ошибка!')
	}
}
