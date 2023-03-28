import mongoose, { Types, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { friendsValidator, profilePathValidator } from "./validators";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export interface IUser {
  _id: Types.ObjectId,
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
  posts: object[],
  createdAt: string,
  updatedAt: string
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true, minlength: 3, maxlength: 30 },
  lastName: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, match: emailRegex, maxlength: 255 },
  password: { type: String, required: true },
  pictureUrl50px: { type: String, default: "assets/pictures/default.svg", maxlength: 1000 },
  pictureUrl100px: { type: String, default: "assets/pictures/default.svg", maxlength: 1000 },
  pictureUrl400px: { type: String, default: "assets/pictures/default.svg", maxlength: 1000 },
  profilePath: {
    type: String,
    maxlength: 30,
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
  city: { type: String, maxlength: 300, default: null },
  occupation: { type: String, maxlength: 100, default: null },
  status: { type: String, maxlength: 300, default: null },
  canAnyonePost: {
    type: Boolean,
    default: true
  },
  posts: {
    type: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    default: []
  }
}, { timestamps: true })


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


const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;