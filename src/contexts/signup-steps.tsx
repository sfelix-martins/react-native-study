import { createContext, useContext, useState, useEffect } from 'react';
import React from 'react';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactLink?: string;
  company?: string;
  phone?: string;
  avatar?: string;
}

type StepOneData = Pick<User, 'firstName' | 'lastName'>;
type StepTwoData = Pick<User, 'firstName' | 'lastName'>;

interface SignUpStepsData {
  goToNextStep(data: StepOneData): void;
}

const SignUpStepsContext = createContext<SignUpStepsData>(
  {} as SignUpStepsData,
);

// TODO: Validate steps data on context or component??
const SignUpStepsProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  function goToNextStep(data: StepOneData) {
    if (user) {
      setUser({ ...user, ...data });
      return;
    }
    setUser(data as User);
  }

  return (
    <SignUpStepsContext.Provider value={{ goToNextStep }}>
      {children}
    </SignUpStepsContext.Provider>
  );
};

export default SignUpStepsProvider;

export function useSignUpStepper() {
  return useContext(SignUpStepsContext);
}
