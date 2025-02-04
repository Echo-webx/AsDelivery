export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
export const TOKEN_EXPIRES = new Date(
	Date.now() +
		(Number(process.env.NEXT_PUBLIC_TOKEN_EXPIRES) || 1 / 24) *
			24 *
			60 *
			60 *
			1000
)
