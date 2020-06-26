import gql from 'graphql-tag';
import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  useApolloClient,
  useLazyQuery,
  useMutation,
} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';

interface AuthContextData {
  signed: boolean;
  user: User | undefined | null;
  signIn(user: SignInVariables): Promise<any>;
  logout(): Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const SIGN_IN = gql`
  mutation Login($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      accessToken
    }
  }
`;

const GET_USER = gql`
  query {
    me {
      firstName
      lastName
      email
      company
      site
      avatar
      id
    }
  }
`;

interface SignInVariables {
  email: string;
  password: string;
}
interface SignInResult {
  login: {
    accessToken: string;
  };
}
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  site: string;
  avatar: string;
}

interface GetUserResult {
  me: User;
}

export const AuthProvider: React.FC = ({ children }) => {
  const client = useApolloClient();
  const [user, setUser] = useState<User | undefined | null>(null);
  const [loading, setLoading] = useState(true);

  const [getUser, { data: userData }] = useLazyQuery<GetUserResult>(GET_USER);
  const [signInMutation, { data: signInData }] = useMutation<
    SignInResult,
    SignInVariables
  >(SIGN_IN);

  useEffect(() => {
    async function loadStorageData() {
      const [
        [, storagedUser],
        [, storagedToken],
      ] = await AsyncStorage.multiGet(['@Levare:user', '@Levare:token']);

      if (storagedToken && storagedUser) {
        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  useEffect(() => {
    async function storeToken() {
      const accessToken = signInData?.login.accessToken;

      if (accessToken) {
        await AsyncStorage.setItem('@Levare:token', accessToken);

        await client?.resetStore();

        getUser({
          context: {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          },
        });
      }
    }

    if (signInData) {
      storeToken();
    }
  }, [signInData, getUser, client]);

  useEffect(() => {
    async function storeUser() {
      const userToStore = userData?.me;

      await AsyncStorage.setItem('@Levare:user', JSON.stringify(userToStore));
      setUser(userToStore);
    }

    if (userData) {
      storeUser();
    }
  }, [userData]);

  async function signIn(variables: SignInVariables) {
    return await signInMutation({ variables });
  }

  async function logout() {
    AsyncStorage.clear();
    client.resetStore();
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

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
