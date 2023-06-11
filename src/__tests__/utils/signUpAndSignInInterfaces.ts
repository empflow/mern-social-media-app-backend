export interface ISignUpData {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}


export type TSignInData = Omit<ISignUpData, "firstName" | "lastName">;
