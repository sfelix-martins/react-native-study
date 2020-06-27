import {
  DefaultTheme,
  configureFonts,
  Theme,
  DarkTheme,
} from 'react-native-paper';

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
};

export default theme;
