import mongoose, { Types, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { friendsValidator, profilePathValidator } from "./validators";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const maxLengths = {
  firstName: 30,
  lastName: 30,
  profilePath: 30,
  email: 255,
  pictureUrl: 1000,
  city: 100,
  occupation: 300,
  status: 300
}

export const minLengths = {
  firstName: 3,
  lastName: 3
}

export interface IUser {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  pictureUrl50px: string,
  pictureUrl100px: string,
  pictureUrl400px: string,
  profilePath: string,
  friends: object[],
  friendRequestsReceived: object[],
  friendRequestsSent: object[],
  birthday: Date,
  city: string | null,
  occupation: string | null,
  status: string | null,
  canAnyonePost: boolean,
  createdAt: string,
  updatedAt: string
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true, minlength: minLengths.firstName, maxlength: maxLengths.firstName },
  lastName: { type: String, required: true, minlength: minLengths.lastName, maxlength: maxLengths.lastName },
  email: { type: String, required: true, unique: true, match: emailRegex, maxlength: maxLengths.email },
  password: { type: String, required: true },
  pictureUrl50px: { type: String, default: "assets/pictures/default.svg", maxlength: maxLengths.pictureUrl },
  pictureUrl100px: { type: String, default: "assets/pictures/default.svg", maxlength: maxLengths.pictureUrl },
  pictureUrl400px: { type: String, default: "assets/pictures/default.svg", maxlength: maxLengths.pictureUrl },
  profilePath: {
    type: String,
    maxlength: maxLengths.profilePath,
    required: true,
    unique: true,
    validate: profilePathValidator
  },
  friends: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
    validate: friendsValidator
  },
  friendRequestsReceived: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: []
  },
  friendRequestsSent: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: []
  },
  birthday: { type: Date, default: null },
  city: { type: String, maxlength: maxLengths.city, default: null },
  occupation: { type: String, maxlength: maxLengths.occupation, default: null },
  status: { type: String, maxlength: maxLengths.status, default: null },
  canAnyonePost: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });


UserSchema.pre("save", async function (next) {
  if (!this.isNew) return; // only run on the initial creation of the document
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

UserSchema.methods.comparePasswords = async function (candidatePassword: string) {
  console.log(candidatePassword, this.password);
  return await bcrypt.compare(candidatePassword, this.password);
}

UserSchema.methods.createJwt = async function () {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}


const User = mongoose.model<IUser>("User", UserSchema);
export default User;