export interface ISignUpData {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

export type TLogInData = Omit<ISignUpData, "firstName" | "lastName">;