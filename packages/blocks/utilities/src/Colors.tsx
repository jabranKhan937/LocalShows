// Customizable Area Start
import invert from 'invert-color';

/* get colors */
export const colors = (idDark=false) => {
  const lightColors:any = {
    background: '#FCFCFF',
    primary: '#512DA8',
    text: '#334155',
    error: '#D32F2F',
    black: '#000',
    white: '#fff',
  }

  const darkColors:any = {}
  for (const colors in lightColors) {
    darkColors[colors] = invert(lightColors[colors]);
  }
  return idDark ? darkColors : lightColors;
}

/** Design tokens from localshows-redesign.vercel.app (home redesign). */
export const redesignTheme = {
  background: '#08080f',
  card: '#111120',
  foreground: '#f0eeff',
  muted: '#8880aa',
  primary: '#ff2d6b',
  accent: '#ffe138',
  featuredTime: '#00d4ff',
  input: '#1a1a2e',
  border: 'rgba(255, 255, 255, 0.08)',
  primarySoft: 'rgba(255, 45, 107, 0.15)',
} as const;
// Customizable Area End