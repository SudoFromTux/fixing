import { Document, Schema, model } from "mongoose";

interface User extends Document {
  username: string;
  email: string;
  password: string;
  passwordResetOtpHash?: string | null;
  passwordResetOtpExpiresAt?: Date | null;
}

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetOtpHash: {
      type: String,
      default: null,
    },
    passwordResetOtpExpiresAt: {
      type: Date,
      default: null,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const UserModel = model("User", userSchema);

export default UserModel;
