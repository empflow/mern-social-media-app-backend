import mongoose from "mongoose";
import bcrypt from "bcrypt";


const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    match: emailRegex,
    maxlength: 255,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50
  },
  pictureUrl50px: {
    type: String,
    default: "assets/pictures/default50.png",
    maxlength: 1000
  },
  pictureUrl100px: {
    type: String,
    default: "assets/pictures/default100.png",
    maxlength: 1000
  },
  pictureUrl400px: {
    type: String,
    default: "assets/pictures/default400.png",
    maxlength: 1000
  },
  friends: {
    type: Array,
    default: []
  },
  birthday: {
    type: Date
  },
  address: {
    type: String,
    maxlength: 300
  },
  occupation: {
    type: String,
    maxlength: 100
  },
  status: {
    type: String,
    maxlength: 300 
  },
}, { timestamps: true })

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})


const UserModel = mongoose.model("User", UserSchema);
export default UserModel;