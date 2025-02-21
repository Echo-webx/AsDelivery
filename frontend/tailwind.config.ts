import type { Config } from 'tailwindcss'

import { COLORS } from './src/consts/colors.constants'

const config: Config = {
	darkMode: 'selector',
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			colors: COLORS
		}
	},
	plugins: []
}
export default config
