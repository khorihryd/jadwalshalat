/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				'berkshire-swash': ['Berkshire Swash',
					'serif'],
			},
		},
	},
	plugins: [],
}