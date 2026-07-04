/** @type {import('tailwindcss').Config} */

module.exports = {
	darkMode: ['class'],
	mode: 'jit',
	content: ['./src/**/**/*.{js,jsx,ts,tsx}'],
	theme: {
		fontFamily: {
			lato: [
				'Lato'
			],
			'dm-sans': [
				'DM Sans'
			],
			santander: [
				'SantanderText'
			]
		},
		colors: {
			primary: '#EC0000',
			'primary-hover': '#07969a',
			secondary: '#8EB4C0',
			tertiary: '#F0F6FA',
			cta: '#EC0039',
			success: '#4EC291',
			error: '#F52046',
			link: '#FF693A',
			disabled: '#AAB4BD',
			'disabled-alt': '#EAECEE',
			'disabled-gray': '#D0D0D0',
			hover: '#D60033',
			focus: '#6395AA',
			black: '#131313',
			white: '#FFFFFF',
			skyBlue: '#DEEDF2',
			'sidebar-bg': '#07969a',
			'sidebar-item-bg': '#07969a',
			'sidebar-item-text': '#FFFFFF',
			'sidebar-item-hover-bg': '#FFFFFF',
			'sidebar-item-hover-text': '#131313',
			'navbar-bg': '#FFFFFF',
			'navbar-border-bg': '#F4F4F4',
			'profile-bg': '#0dbfbf',
			'profile-text': '#FFFFFF',
			'power-icon-bg': '#FF3E6C',
			'power-icon-hover-bg': '#07969a',
			'agriculture-icon-border': '#07969a',
			'agriculture-icon-text': '#07969a',
			'table-header-bg': '#1f2937',
			'table-header-text': '#FFFFFF',
			'search-text': '#888888',
			'table-text': '#888888',
			'agriculture-icon-border-container-in-login': '#07969a',
			'login-left-section-bg': '#0dbfbf',
			'login-left-section-via-bg': '#95faf1',
			'login-left-section-to-bg': '#0e5d61',
			'tab-line-bg': '#07969a',
			'tab-selected-hover-bg': '#FFFFFF',
			'tab-text-selected-hover-bg': '#131313',
			'tab-bg': '#07969a',
			'tab-text-selected': '#FFFFFF',
			'pagination-disabled-text': '#929292',
			'pagination-disabled-bg': '#E8E8E8',
			'pagination-bg': '#07969a',
			'pagination-text': '#FFFFFF',
			'golden-fizz': {
				'50': '#fafee8',
				'100': '#f2fec3',
				'200': '#eafe8a',
				'300': '#e5fd47',
				'400': '#e5fa15',
				'500': '#ebf709',
				'600': '#cac404',
				'700': '#a18f07',
				'800': '#85700e',
				'900': '#715b12',
				'950': '#423206'
			},
			'light-gray': {
				'100': '#F8F8F8',
				'150': '#D9E8EF',
				'200': '#F4F4F4',
				'250': '#F3F3F3',
				'300': '#EFEFEF'
			},
			'bright-turquoise': {
				'50': '#effefc',
				'100': '#cafdf8',
				'200': '#95faf1',
				'300': '#50efe8',
				'400': '#26dbd8',
				'500': '#0dbfbf',
				'600': '#07969a',
				'700': '#0b757a',
				'800': '#0e5d61',
				'900': '#114d50',
				'950': '#022d31'
			},
			teal: {
				'50': '#f0fdfa',
				'100': '#ccfbf1',
				'200': '#99f6e4',
				'300': '#5eead4',
				'400': '#2dd4bf',
				'500': '#14b8a6',
				'600': '#0d9488',
				'700': '#0f766e',
				'800': '#115e59',
				'900': '#134e4a',
				'950': '#042f2e'
			},
			main: {
				// '50': '#e8f5ff',
				// '100': '#d5ecff',
				// '200': '#b3daff',
				// '300': '#85bfff',
				// '400': '#5695ff',
				// '500': '#2f6bff', // color principal
				// '600': '#0c3bff',
				// '700': '#0432ff',
				// '800': '#062dcd',
				// '900': '#10309f',
				// '950': '#0a1a5c'
				'50': '#f0f5fe',
				'100': '#dde7fc',
				'200': '#c3d6fa',
				'300': '#9abdf6',
				'400': '#6a9af0',
				'500': '#4776ea',
				'600': '#3d61e0',
				'700': '#2945cc',
				'800': '#2739a6',
				'900': '#253483',
				'950': '#1b2250',
			},
			"fb-gray": {
				"50": "#f9fafb",
				"100": "#f3f4f6",
				"200": "#e5e7eb",
				"300": "#d1d5db",
				"400": "#9ca3af",
				"500": "#6b7280",
				"600": "#4b5563",
				"700": "#374151",
				"800": "#1f2937",
				"900": "#111827",
				"950": "#030712",
			},
			emerald: {
				'50': '#ecfdf5',
				'100': '#d1fae5',
				'200': '#a7f3d0',
				'300': '#6ee7b7',
				'400': '#34d399',
				'500': '#10b981',
				'600': '#059669',
				'700': '#047857',
				'800': '#065f46',
				'900': '#064e3b',
				'950': '#022c22'
			},
			malachite: {
				'50': '#f1fcf1',
				'100': '#dff9e1',
				'200': '#c1f1c4',
				'300': '#90e597',
				'400': '#56cf60',
				'500': '#32b53d',
				'600': '#24952e',
				'700': '#1f7627',
				'800': '#1e5d24',
				'900': '#1a4d20',
				'950': '#092a0e'
			},
			gray: {
				'50': '#f9fafb',
				'100': '#f3f4f6',
				'200': '#e5e7eb',
				'300': '#d1d5db',
				'400': '#9ca3af',
				'500': '#6b7280',
				'600': '#4b5563',
				'700': '#374151',
				'800': '#1f2937',
				'900': '#111827',
				'950': '#030712'
			},
			red: {
				'50': '#fff0f0',
				'100': '#ffdddd',
				'200': '#ffc0c0',
				'300': '#ff9494',
				'400': '#ff5757',
				'500': '#ff2323',
				'600': '#ff0000',
				'700': '#d70000',
				'800': '#b10303',
				'900': '#920a0a',
				'950': '#500000'
			},
			blue: {
				'50': '#ecf9ff',
				'100': '#d4f0ff',
				'200': '#b2e7ff',
				'300': '#7ddaff',
				'400': '#40c2ff',
				'500': '#14a0ff',
				'600': '#007fff',
				'700': '#0067ff',
				'800': '#0056d6',
				'900': '#0848a0',
				'950': '#0a2d61',
			},
			yellow: {
				"50": "#fefce8",
				"100": "#fef9c3",
				"200": "#fef08a",
				"300": "#fde047",
				"400": "#facc15",
				"500": "#eab308",
				"600": "#ca8a04",
				"700": "#a16207",
				"800": "#854d0e",
				"900": "#713f12",
				"950": "#422006",
			},
			// green: {
			// 	'50': '#e7ffe4',
			// 	'100': '#c9ffc4',
			// 	'200': '#98ff90',
			// 	'300': '#56ff50',
			// 	'400': '#00ff00',
			// 	'500': '#00e606',
			// 	'600': '#00b809',
			// 	'700': '#008b07',
			// 	'800': '#076d0d',
			// 	'900': '#0b5c11',
			// 	'950': '#003406'
			// },
			red: {
				"50": "#fef2f2",
				"100": "#fee2e2",
				"200": "#fecaca",
				"300": "#fca5a5",
				"400": "#f87171",
				"500": "#ef4444",
				"600": "#dc2626",
				"700": "#b91c1c",
				"800": "#991b1b",
				"900": "#7f1d1d",
				"950": "#450a0a",
			},
			green: {
				"50": "#f0fdf4",
				"100": "#dcfce7",
				"200": "#bbf7d0",
				"300": "#86efac",
				"400": "#4ade80",
				"500": "#22c55e",
				"600": "#16a34a",
				"700": "#15803d",
				"800": "#166534",
				"900": "#14532d",
				"950": "#052e16",
			},
			border: '#b7b7b7',
			check: '#58C4C6',
			'input-border': '#b2d2df',
			input: '#d1d5db',
			subtitle: '#69717A',
			placeholder: '#808B95'
		},
		extend: {
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontSize: {
				'hero-1': [
					'5.125rem',
					{
						lineHeight: '5.875rem',
						fontWeight: '700',
						letterSpacing: '-0.01em'
					}
				],
				'hero-2': [
					'4.25rem',
					{
						lineHeight: '4.75rem',
						fontWeight: '700',
						letterSpacing: '-0.01em'
					}
				],
				'heading-h1': [
					'3.75rem',
					{
						lineHeight: '4.25rem',
						fontWeight: '700',
						letterSpacing: '-0.02em'
					}
				],
				'heading-h2': [
					'3.125rem',
					{
						lineHeight: '3.75rem',
						fontWeight: '700',
						letterSpacing: '-0.02em'
					}
				],
				'heading-h3': [
					'2.75rem',
					{
						lineHeight: '3.5rem',
						fontWeight: '700',
						letterSpacing: '-0.02em'
					}
				],
				'heading-h4': [
					'2.125rem',
					{
						lineHeight: '2.5rem',
						fontWeight: '700',
						letterSpacing: '-0.02em'
					}
				],
				'heading-h5': [
					'1.75rem',
					{
						lineHeight: '2rem',
						fontWeight: '700',
						letterSpacing: '-0.02em'
					}
				],
				'heading-h6': [
					'1.5rem',
					{
						lineHeight: '1.75rem',
						fontWeight: '700',
						letterSpacing: '-0.02em'
					}
				],
				headline: [
					'3rem',
					{
						lineHeight: '3.5rem',
						fontWeight: '700',
						letterSpacing: '-0.02em'
					}
				],
				'subtitle-lg': [
					'1.75rem',
					'2.5rem'
				],
				'subtitle-md': [
					'1.5rem',
					'2.25rem'
				],
				'subtitle-sm': [
					'1.25rem',
					'1.75rem'
				],
				'body-lg': [
					'1.125rem',
					'1.625rem'
				],
				'body-md': [
					'1rem',
					'1.5rem'
				],
				'body-sm': [
					'0.875rem',
					'1.375rem'
				],
				'body-xs': [
					'0.875rem',
					'1.125rem'
				],
				'body-xxs': [
					'0.75rem',
					'1rem'
				],
				'body-xxxs': [
					'0.68rem',
					'1.156rem'
				],
				'home-title': [
					'1.375rem'
				]
			},
			boxShadow: {
				card: '0px 2px 37px -6px rgba(0, 0, 0, 0.09)',
				cta: '0px 3.36246px 6px rgba(245, 32, 83, 0.3)',
				button: '0px 3.36246px 16.8123px rgba(245, 32, 83, 0.3)'
			},
			gridTemplateColumns: {
				'15/85': '15% 85%',
				'20/80': '20% 80%',
				'33/33/33': '33% 33% 33%',
				'20/20/60': '20% 20% 60%',
				'25/25/25/25': '25% 25% 25% 25%',
				'20/20/20/20/20': '20% 20% 20% 20% 20%',
				'5/19/19/19/19/19': '5% 19% 19% 19% 19% 19%'
			},
			spacing: {
				'87': '27rem'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				// La paleta `colors` de arriba reemplaza los defaults de Tailwind, así
				// que faltaban estos. Los reponemos (transparent/current son clave para
				// que funcionen clases como dark:bg-transparent).
				transparent: 'transparent',
				current: 'currentColor',
				// `slate` para sidebar/zebra/skeleton/tabs.
				slate: {
					'50': '#f8fafc',
					'100': '#f1f5f9',
					'200': '#e2e8f0',
					'300': '#cbd5e1',
					'400': '#94a3b8',
					'500': '#64748b',
					'600': '#475569',
					'700': '#334155',
					'800': '#1e293b',
					'900': '#0f172a',
					'950': '#020617',
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}
