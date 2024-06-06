import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['"eudoxus sans"', 'system-ui', 'sans-serif']
    }
  }
} satisfies Config;
