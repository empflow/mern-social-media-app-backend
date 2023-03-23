import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { friendsValidator, profilePathValidator } from "./validators";


const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 3, maxlength: 30 },
  lastName: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: { type: String, unique: true, match: emailRegex, maxlength: 255, required: true },
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
    type: [{ type: Types.ObjectId, ref: "User" }],
    sparse: true,
    validate: {
      validator: friendsValidator,
      message: "this person already exists in the list of your friends"
    }
  },
  birthday: Date,
  city: { type: String, maxlength: 300 },
  occupation: { type: String, maxlength: 100 },
  status: { type: String, maxlength: 300 },
}, { timestamps: true })


UserSchema.pre("save", async function (next) {
  if (!this.isNew) return; // only run on initial creation of the document
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


const UserModel = mongoose.model("User", UserSchema);
export default UserModel;