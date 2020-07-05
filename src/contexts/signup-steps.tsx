import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import React from 'react';
import * as Yup from 'yup';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  site?: string;
  company?: string;
  whatsapp?: string;
  certified: boolean;
  avatar?: string;
}

type StepOneData = Pick<User, 'firstName' | 'lastName'>;
type StepTwoData = Pick<User, 'email' | 'password'>;
export type StepThreeData = Pick<
  User,
  'site' | 'company' | 'whatsapp' | 'certified'
>;

type StepData = StepOneData | StepTwoData | StepThreeData;

interface SignUpStepsData {
  /**
   * Check if user can go to next step according to validationSchema and store
   * data on provider state if has no errors.
   *
   * @throws Yup.ValidationError
   */
  goToNextStep(data: StepData): Promise<void>;
  /**
   * Set an Yup validation schema to use on validate on goToNextStep() call.
   */
  setValidationSchema(schema: Yup.Schema<any> | null): void;
  finishSignUp(): Promise<void>;
}

const SignUpStepsContext = createContext<SignUpStepsData>(
  {} as SignUpStepsData,
);

const SIGN_UP = gql`
  mutation createUser(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $company: String
    $site: String
    $whatsapp: String
    $certified: Boolean
    $avatar: String
  ) {
    createUser(
      data: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        company: $company
        site: $site
        whatsapp: $whatsapp
        avatar: $avatar
        certified: $certified
      }
    ) {
      id
      firstName
    }
  }
`;

interface SignUpResult {
  createUser: User;
}

interface SignUpVariables extends User {}

// TODO: Validate steps data on context or component??
const SignUpStepsProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [validationSchema, setValidationSchema] = useState<Yup.Schema<
    any
  > | null>(null);

  const [signUpMutation] = useMutation<SignUpResult, SignUpVariables>(SIGN_UP);

  const finishSignUp = useCallback(async () => {
    if (user) {
      await signUpMutation({ variables: user });
    }
  }, [signUpMutation, user]);

  const goToNextStep = useCallback(
    async (data: StepData) => {
      if (validationSchema) {
        await validationSchema.validate(data, {
          abortEarly: false,
        });
      }

      if (user) {
        setUser({ ...user, ...data });
        return;
      }
      setUser(data as User);
    },
    [user, validationSchema],
  );

  return (
    <SignUpStepsContext.Provider
      value={{ goToNextStep, finishSignUp, setValidationSchema }}>
      {children}
    </SignUpStepsContext.Provider>
  );
};

export default SignUpStepsProvider;

export function useSignUpStepper() {
  return useContext(SignUpStepsContext);
}
