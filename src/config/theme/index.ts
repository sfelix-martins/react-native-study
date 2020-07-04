import { DefaultTheme, configureFonts, Theme } from 'react-native-paper';

const fonts = configureFonts({
  default: {
    regular: {
      fontFamily: 'KronaOne-Regular.ttf',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'KronaOne-Regular.ttf',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'KronaOne-Regular.ttf',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'KronaOne-Regular.ttf',
      fontWeight: 'normal',
    },
  },
});

const theme: Theme = {
  ...DefaultTheme,
  fonts,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2EC625',
  },
};

export default theme;
