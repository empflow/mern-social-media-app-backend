import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 3, maxlength: 30 },
  lastName: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: { type: String, match: emailRegex, maxlength: 255, required: true, unique: true },
  password: { type: String, required: true, minlength: 10, maxlength: 50 },
  pictureUrl50px: { type: String, default: "assets/pictures/default.svg", maxlength: 1000 },
  pictureUrl100px: { type: String, default: "assets/pictures/default.svg", maxlength: 1000 },
  pictureUrl400px: { type: String, default: "assets/pictures/default.svg", maxlength: 1000 },
  profileId: { type: String, maxlength: 30, required: true, unique: true, validate: profileIdValidator },
  friends: { type: Array, default: [] },
  birthday: { type: Date },
  address: { type: String, maxlength: 300 },
  occupation: { type: String, maxlength: 100 },
  status: { type: String, maxlength: 300 },
}, { timestamps: true })

function profileIdValidator(val: string) {
  const urlRegex = /^[a-z0-9-_]+$/i;
  return urlRegex.test(val);
}

UserSchema.pre("save", async function (next) {
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