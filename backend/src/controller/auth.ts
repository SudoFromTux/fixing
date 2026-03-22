import { Request, Response } from "express";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendPasswordResetOtpEmail } from "../config/mailer";

type requiredBodyType = {
  username?: string;
  password: string;
  email?: string;
  otp?: string;
};

const passwordValidation =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const isProduction = process.env.NODE_ENV === "production";

const authCookieBaseOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
} as const;

const authCookieOptions = {
  ...authCookieBaseOptions,
  maxAge: 15 * 24 * 60 * 60 * 1000,
} as const;

function normalizeEmail(email?: string) {
  return email?.trim().toLowerCase();
}

function isPasswordValid(password: string) {
  return passwordValidation.test(password);
}

function createPasswordResetOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export const signUpUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email }: requiredBodyType = req.body;

    const existingUser: requiredBodyType | null = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "user already exist",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "user created successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const signInUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password }: requiredBodyType = req.body;
    const normalizedUsername = username?.trim().toLowerCase();
    const normalizedEmail = email?.trim().toLowerCase();

    const existingUser = await UserModel.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (!existingUser?.password) {
      res.status(400).json({
        success: false,
        message: "invalid username or password",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: "invalid password",
      });
      return;
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET!);

    res
      .status(200)
      .cookie("token", token, authCookieOptions)
      .json({
        success: true,
        message: "user signed in successfully",
        data: {
          token,
          _id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const logOutUser = (req: Request, res: Response) => {
  try {
    res.status(200).clearCookie("token", authCookieBaseOptions).json({
      success: true,
      message: "user logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const sendForgotPasswordOtp = async (req: Request, res: Response) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);

    if (!normalizedEmail) {
      res.status(400).json({
        success: false,
        message: "email is required",
      });
      return;
    }

    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
      return;
    }

    const otp = createPasswordResetOtp();
    const otpExpiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES ?? 10);
    const otpExpiry = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);

    existingUser.passwordResetOtpHash = hashOtp(otp);
    existingUser.passwordResetOtpExpiresAt = otpExpiry;
    await existingUser.save();

    await sendPasswordResetOtpEmail({
      email: existingUser.email,
      username: existingUser.username,
      otp,
      expiryMinutes: otpExpiryMinutes,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to your email successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to send OTP",
    });
  }
};

export const resetPasswordWithOtp = async (req: Request, res: Response) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);
    const { otp, password }: requiredBodyType = req.body;

    if (!normalizedEmail || !otp || !password) {
      res.status(400).json({
        success: false,
        message: "email, otp and password are required",
      });
      return;
    }

    if (!isPasswordValid(password)) {
      res.status(400).json({
        success: false,
        message:
          "Password must include uppercase, lowercase, number, special character, and be at least 8 characters long.",
      });
      return;
    }

    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
      return;
    }

    if (
      !existingUser.passwordResetOtpHash ||
      !existingUser.passwordResetOtpExpiresAt
    ) {
      res.status(400).json({
        success: false,
        message: "Please request a new OTP.",
      });
      return;
    }

    if (existingUser.passwordResetOtpExpiresAt.getTime() < Date.now()) {
      existingUser.passwordResetOtpHash = null;
      existingUser.passwordResetOtpExpiresAt = null;
      await existingUser.save();

      res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
      return;
    }

    const isOtpValid = existingUser.passwordResetOtpHash === hashOtp(otp);

    if (!isOtpValid) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
      return;
    }

    existingUser.password = await bcrypt.hash(password, 10);
    existingUser.passwordResetOtpHash = null;
    existingUser.passwordResetOtpExpiresAt = null;
    await existingUser.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. Please sign in.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
