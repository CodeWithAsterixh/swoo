import mongoose, { Schema, model, Document, Model } from "mongoose";
import { ElementSchema, IElement } from "./Element";

export interface IPage {
  id: string;
  elements: IElement[];
}

export interface ICanvas {
  width: number;
  height: number;
  backgroundColor?: string;
}

export interface IProject {
  userId?: string;
  name: string;
  templateId?: string;
  status: "draft" | "saved" | "submitted" | "completed";
  pagesCount: number;
  canvas: ICanvas;
  pages: IPage[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectDocument extends IProject, Document {}

const PageSchema = new Schema({
  id: { type: String, required: true },
  elements: { type: [ElementSchema], default: [] },
});

const CanvasSchema = new Schema({
  width: { type: Number, default: 350 },
  height: { type: Number, default: 200 },
  backgroundColor: { type: String, default: "#ffffff" },
});

const ProjectSchema = new Schema<IProjectDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "Template",
      required: false,
    },
    name: { type: String, required: true },
    canvas: { type: CanvasSchema, default: {} },
    pages: { type: [PageSchema], default: [] },
    status: {
      type: String,
      enum: ["draft", "saved", "submitted", "completed"],
      default: "draft",
      index: true,
    },
    pagesCount: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    // Force the MongoDB collection name to `swoocards` so we don't write to the
    // default `test` database/collection when a DB name isn't supplied in the URI.
    collection: "swoocards",
  }
);

// `userId` and `status` already declare `index: true` on their fields above.
// Avoid calling schema.index() again to prevent duplicate-index warnings from Mongoose.

const ProjectModel: Model<IProjectDocument> =
  (mongoose.models && (mongoose.models.Project as Model<IProjectDocument>)) ||
  model<IProjectDocument>("Project", ProjectSchema);

export default ProjectModel;
