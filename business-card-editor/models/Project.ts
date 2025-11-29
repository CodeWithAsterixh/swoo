import { Schema, model, Document } from "mongoose";
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
  { timestamps: true }
);

ProjectSchema.index({ userId: 1 });
ProjectSchema.index({ status: 1 });

export default model<IProjectDocument>("Project", ProjectSchema);
