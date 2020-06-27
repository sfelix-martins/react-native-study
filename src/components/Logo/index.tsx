import React from 'react';
import { Image, ImageProperties } from 'react-native';

import logo from '../../assets/logo.png';

type LogoProps = Omit<ImageProperties, 'source'>;

const Logo: React.FC<LogoProps> = (props) => {
  return <Image {...props} source={logo} />;
};

export default Logo;
