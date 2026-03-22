import { Request, Response } from "express";
import { genHash } from "../config/utils";
import ShareBrainModel from "../models/shareBrain";
import ContentModel from "../models/content";

export const shareBrain = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const { share } = req.body;

    const shareLinkExist = await ShareBrainModel.findOne({ userId });

    if (!share && shareLinkExist) {
      await ShareBrainModel.deleteOne({ userId });
      res.status(200).json({
        success: true,
        message: "share url deleted successfully",
      });
      return;
    }

    const hash = genHash(10);

    if (share && !shareLinkExist) {
      const result = await ShareBrainModel.create({
        hash,
        userId,
      });

      res.status(201).json({
        success: true,
        message: "share url created successfully",
        data: result,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "share link already exist",
      data: shareLinkExist,
    });
  } catch (error) {
    console.error(error);

    // Treat duplicate-key conflicts as an already-existing share link instead
    // of surfacing a generic 500 to the client.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      const existingShareLink = await ShareBrainModel.findOne({
        userId: req.body.userId,
      });

      res.status(200).json({
        success: true,
        message: "share link already exist",
        data: existingShareLink,
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const fetchSharedBrain = async (req: Request, res: Response) => {
  try {
    const hash = req.params.hash;

    const brain = await ShareBrainModel.findOne({ hash });

    if (!brain) {
      res.status(404).json({
        success: false,
        message: "shared url does not exist",
      });
      return;
    }

    const content = await ContentModel.find({ userId: brain.userId }).populate(
      "userId",
      "username"
    );

    res.status(200).json({
      success: true,
      message: "fetched content successfully!",
      data: content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
