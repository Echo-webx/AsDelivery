export const errorCatch = (error: any): string => {
	const message = error?.response?.data?.message

	return message
		? typeof message === 'object'
			? message[0]
			: message
		: error.message
}

export const errorStatus = (error: any): string => {
	if (error?.response?.status) return `${error?.response?.status}`
	if (error?.status) return `${error?.status}`
	if (error?.request) return '404'
	return '500'
}
