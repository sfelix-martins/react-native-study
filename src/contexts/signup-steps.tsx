import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import React from 'react';
import * as Yup from 'yup';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactLink?: string;
  company?: string;
  phone?: string;
  isCertified: boolean;
  avatar?: string;
}

type StepOneData = Pick<User, 'firstName' | 'lastName'>;
type StepTwoData = Pick<User, 'email' | 'password'>;
type StepThreeData = Pick<
  User,
  'contactLink' | 'company' | 'phone' | 'isCertified'
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

// TODO: Validate steps data on context or component??
const SignUpStepsProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [validationSchema, setValidationSchema] = useState<Yup.Schema<
    any
  > | null>(null);

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  const finishSignUp = useCallback(async () => {}, []);

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
