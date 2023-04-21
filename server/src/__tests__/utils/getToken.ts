import mongoose from "mongoose";
import signJwt from "../../utils/signJwt";
import mockUser from "../test_users/mockUser";

export default function getAuthHeader() {
  const token = signJwt({ userId: mockUser._id });
  return `Bearer ${token}`;
}