/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,tsx}"],
    theme: {
        extend: {},
    },
    daisyui: {
        themes: [],
    },
    plugins: [require("daisyui")],
}