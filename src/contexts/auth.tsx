import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../modules/User/services/auth';
import AsyncStorage from '@react-native-community/async-storage';

interface AuthContextData {
  signed: boolean;
  user: object | null;
  signIn(): Promise<void>;
  logout(): Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      // TODO: Change to multiget
      const storagedUser = await AsyncStorage.getItem('@Levare:user');
      const storagedToken = await AsyncStorage.getItem('@Levare:token');

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (storagedToken && storagedUser) {
        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn() {
    const response = await authService.signIn();

    setUser(response.user);
    // TODO: Change to multiset
    await AsyncStorage.setItem('@Levare:user', JSON.stringify(response.user));
    await AsyncStorage.setItem('@Levare:token', JSON.stringify(response.token));
  }

  async function logout() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, signIn, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
