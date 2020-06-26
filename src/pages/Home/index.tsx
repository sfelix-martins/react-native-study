import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { useAuth } from '../../contexts/auth';

const Home: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <View>
      <Text style={{ color: '#fff' }}>
        {user?.firstName} {user?.lastName}
      </Text>
      <Button accessibilityStates onPress={logout}>
        Sair
      </Button>
    </View>
  );
};

export default Home;
