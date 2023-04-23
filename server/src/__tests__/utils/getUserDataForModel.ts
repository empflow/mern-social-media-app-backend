import { getRandomProfilePath } from "../../utils/pathsGenerators";
import getSignUpData from "./getSignUpData";

export default function getUserDataForModel() {
  return {
    ...getSignUpData(),
    profilePath: getRandomProfilePath()
  }
}