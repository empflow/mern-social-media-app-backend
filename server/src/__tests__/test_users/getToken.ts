import signJwt from "../../utils/signJwt";
import mockUser from "./mockUser";

export default function getToken() {
  return signJwt({ userId: mockUser._id });
}