import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function userAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "you are not authorized! No token provided.",
      });
      return;
    }

    const result = jwt.verify(token, process.env.JWT_SECRET!);

    if (!result) {
      res.status(401).json({
        success: false,
        message: "you are not authorized!",
      });
      return;
    }

    // @ts-ignore
    req.body.userId = result.id;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error,
    });
  }
}
