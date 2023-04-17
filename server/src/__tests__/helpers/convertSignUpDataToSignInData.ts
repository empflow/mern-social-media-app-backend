import { TSignInData, ISignUpData } from "./signUpAndSignInInterfaces";

export default function convertSignUpDataToSignInData(signUpData: ISignUpData) {
  const logInData: TSignInData = {
    email: signUpData.email,
    password: signUpData.password
  }

  return logInData;
}