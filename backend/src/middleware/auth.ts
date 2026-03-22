import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function userAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const cookieToken = req.cookies.token;
    const authorizationHeader = req.headers.authorization;
    const bearerToken = authorizationHeader?.startsWith("Bearer ")
      ? authorizationHeader.slice("Bearer ".length)
      : undefined;
    const token = cookieToken || bearerToken;

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
