export const THEME_COLORS = {
  dark: {
    cellRGB: '204, 123, 47',
    gridColor: 'rgba(255, 255, 255, 0.15)'
  },
  light: {
    cellRGB: '166, 80, 8', // Darker bronze for contrast
    gridColor: 'rgba(0, 0, 0, 0.1)'
  }
};

export const getCanvasColors = (theme: 'light' | 'dark') => THEME_COLORS[theme];
