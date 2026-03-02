import type { Config } from "tailwindcss";

const config: Config = {
    // THIS IS THE MAGICAL FORCEFIELD 
    important: true,

    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./widget.tsx", // Make sure it reads our widget file too!
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

export default config;