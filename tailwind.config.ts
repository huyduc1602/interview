import type { Config } from 'tailwindcss';
import typographyPlugin from '@tailwindcss/typography';
import scrollbarPlugin from 'tailwind-scrollbar';

const config: Config = {
    content: [
        "./src/**/*.{ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                ring: "hsl(var(--ring))",
            },
            animation: {
                pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                pulse: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '.5' },
                },
            },
            typography: {
                DEFAULT: {
                    css: {
                        'code::before': {
                            content: '""'
                        },
                        'code::after': {
                            content: '""'
                        },
                        code: {
                            backgroundColor: 'rgb(var(--muted))',
                            padding: '0.2em 0.4em',
                            borderRadius: '0.25rem',
                            fontWeight: '400',
                        },
                        pre: {
                            backgroundColor: 'rgb(var(--muted))',
                            code: {
                                backgroundColor: 'transparent',
                                padding: 0,
                            }
                        }
                    }
                }
            }
        },
    },
    plugins: [
        typographyPlugin,
        scrollbarPlugin,
    ],
    variants: {
        extend: {
            scrollbar: ['rounded', 'dark']
        }
    }
};

export default config;
