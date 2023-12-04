/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.{html,js,ejs}", "./resources/**/*.{html,js,ejs}"],
    theme: {
        extend: {
            colors: {
                primary: "#796aff",
                secondary: "#4337c9",
                pure: "#ffffff",
                dark: "#232323",
                gray: "#ccc",
                info: "#7d8da1",
                danger: " #ff7782",
                success: " #41f1b6",
                warning: "#fea520",
                lightDark: "#292929",
                boxColor: "#373737",
            },
        },
    },
    plugins: [],
};
