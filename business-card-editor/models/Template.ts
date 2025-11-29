import { Schema, model, Document } from 'mongoose';
import type { IElement } from './Element';

export interface ITemplate {
  name: string;
  thumbnail?: string;
  elements: IElement[];
  metadata?: Record<string, any>;
}

export interface ITemplateDocument extends ITemplate, Document {}

const TemplateSchema = new Schema<ITemplateDocument>({
  name: { type: String, required: true },
  category: { type: String, index: true },
  thumbnail: { type: String },
  assets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
  elements: { type: [Schema.Types.Mixed], default: [] },
  metadata: { type: Schema.Types.Mixed, default: {} },
});

TemplateSchema.index({ category: 1 });

export default model<ITemplateDocument>('Template', TemplateSchema);
