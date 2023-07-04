import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { friendsValidator } from "./validators";
import getEnvVar from "../utils/getEnvVar";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const maxLengths: Record<string, any> = {
  firstName: 30,
  lastName: 30,
  profilePath: 30,
  email: 254,
  password: 100,
  avatarUrl: 1000,
  city: 100,
  occupation: 300,
  status: 300,
};

export const minLengths: Record<string, any> = {
  firstName: 3,
  lastName: 3,
  profilePath: 3,
  email: 7,
  password: 10,
};

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarUrl400px: string;
  avatarUrl200px: string;
  avatarUrl100px: string;
  profilePath: string;
  friends: object[];
  friendRequestsReceived: object[];
  friendRequestsSent: object[];
  birthday: Date;
  city: string | null;
  occupation: string | null;
  status: string | null;
  canAnyonePost: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAvatarUrls {
  avatarUrl400px: string;
  avatarUrl200px: string;
  avatarUrl100px: string;
}

const defaultAvatarUrl400px = getEnvVar("DEFAULT_AVATAR_URL_400_PX");
const defaultAvatarUrl200px = getEnvVar("DEFAULT_AVATAR_URL_200_PX");
const defaultAvatarUrl100px = getEnvVar("DEFAULT_AVATAR_URL_100_PX");

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      minlength: minLengths.firstName,
      maxlength: maxLengths.firstName,
    },
    lastName: {
      type: String,
      required: true,
      minlength: minLengths.lastName,
      maxlength: maxLengths.lastName,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailRegex,
      maxlength: maxLengths.email,
    },
    password: { type: String, required: true },
    avatarUrl400px: {
      type: String,
      default: defaultAvatarUrl400px,
      maxlength: maxLengths.pictureUrl,
    },
    avatarUrl200px: {
      type: String,
      default: defaultAvatarUrl200px,
      maxlength: maxLengths.pictureUrl,
    },
    avatarUrl100px: {
      type: String,
      default: defaultAvatarUrl100px,
      maxlength: maxLengths.pictureUrl,
    },
    profilePath: {
      type: String,
      maxlength: maxLengths.profilePath,
      minlength: minLengths.profilePath,
      required: true,
      unique: true,
      match: /^[a-z0-9-_]+$/i,
    },
    friends: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
      validate: friendsValidator,
    },
    friendRequestsReceived: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    friendRequestsSent: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    birthday: { type: Date, default: null },
    city: { type: String, maxlength: maxLengths.city, default: null },
    occupation: {
      type: String,
      maxlength: maxLengths.occupation,
      default: null,
    },
    status: { type: String, maxlength: maxLengths.status, default: null },
    canAnyonePost: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isNew) return; // only run on the initial creation of the document
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePasswords = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.createJwt = async function () {
  const JWT_SECRET = getEnvVar("JWT_SECRET");
  const JWT_EXPIRES_IN = getEnvVar("JWT_EXPIRES_IN");

  return jwt.sign({ userId: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
