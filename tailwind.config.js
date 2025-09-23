/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857", // Primary emerald color used in design
          800: "#065f46",
          900: "#064e3b",
        },
        amber: {
          400: "#fbbf24", // For logo gradient
          500: "#f59e0b",
          600: "#d97706", // For logo gradient
        },
      },
      fontFamily: {
        arabic: ["Cairo", "Tajawal", "Amiri", "serif"], // Add Arabic fonts
        sans: ["Inter", "Cairo", "system-ui", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "islamic-pattern": `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm10 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      screens: {
        xs: "475px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [
    // Add form plugin for better form styling (install with: npm install @tailwindcss/forms)
    // require('@tailwindcss/forms')({
    //   strategy: 'class',
    // }),
  ],
};
