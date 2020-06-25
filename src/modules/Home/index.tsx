import React, { useContext } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import AuthContext from '../../contexts/auth';

const Home: React.FC = () => {
  const { logout } = useContext(AuthContext);

  return (
    <View>
      <Button accessibilityStates onPress={logout}>
        Sair
      </Button>
    </View>
  );
};

export default Home;
