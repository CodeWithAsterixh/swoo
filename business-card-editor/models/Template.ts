/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model, Document } from 'mongoose';
import type { IElement } from './Element';

export interface ITemplate {
  name: string;
  category?: string;
  thumbnail?: string;
  assets?: string[];
  elements: IElement[];
  metadata?: Record<string, any>;
}

export interface ITemplateDocument extends ITemplate, Document {}

const TemplateSchema = new Schema<ITemplateDocument>({
  name: { type: String, required: true },
  category: { type: String, index: true },
  thumbnail: { type: String },
  assets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
  // elements stored as a plain array (mixed documents). Using `Array` here
  // avoids a TypeScript incompatibility with the complex Schema.Types.Mixed typing.
  elements: { type: Array as any, default: [] },
  metadata: { type: Schema.Types.Mixed, default: {} },
});

TemplateSchema.index({ category: 1 });

export default model<ITemplateDocument>('Template', TemplateSchema);
