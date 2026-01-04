/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts,js}",
    ],
    theme: {
        extend: {
            colors: {
                brand: '#187A69',
                'brand-variant': '#BFF426',
                'text-primary': '#273230',
                'text-secondary': '#757575',
                'bg-light': '#F9FAFB',
                'bg-light-beige': '#F6F1EB',
                'bg-medium-beige': '#F6F1EB',
                'border-01': '#D9D9D9',
                'text-beige': '#ECE4D0',
            }
        },
    },
    plugins: [],
}
