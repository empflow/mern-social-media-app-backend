import { TSignInData, ISignUpData } from "./signUpAndSignInInterfaces";

export default function signUpDataToSignInData(signUpData: ISignUpData) {
  const logInData: TSignInData = {
    email: signUpData.email,
    password: signUpData.password
  }

  return logInData;
}