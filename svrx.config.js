module.exports = {
    plugins: [
        {
            name: "less",
            options: {
                src: "assets/less",
                dest: "assets/css",
            },
        },
        {
            name: "tailwindcss",
            options: {
                src: "assets/tailwindcss.css",
                dest: "assets/css/tailwindcss.min.css",
            },
        },
    ],
};
