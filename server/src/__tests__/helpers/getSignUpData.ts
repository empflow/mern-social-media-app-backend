import { faker } from "@faker-js/faker";
import { ISignUpData } from "./signUpAndSignInInterfaces";

export default function getSignUpData() {
  const data: ISignUpData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }

  return data;
}