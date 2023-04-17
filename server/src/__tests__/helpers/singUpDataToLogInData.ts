import { TLogInData, ISignUpData } from "./signUpAndSignInInterfaces";

export default function signUpDataToLogInData(signUpData: ISignUpData) {
  const logInData: TLogInData = {
    email: signUpData.email,
    password: signUpData.password
  }

  return logInData;
}