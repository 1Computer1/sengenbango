/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			width: {
				screen: ['100vw', '100dvw'],
			},
			maxWidth: {
				screen: ['100vw', '100dvw'],
			},
			height: {
				screen: ['100vh', '100dvh'],
			},
			maxHeight: {
				screen: ['100vh', '100dvh'],
			},
		},
	},
	plugins: [require('@savvywombat/tailwindcss-grid-areas')],
};
