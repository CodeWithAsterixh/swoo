import { Document, Schema, model } from 'mongoose';

export type AssetType = 'image' | 'icon' | 'logo';

export interface IAsset {
  type: AssetType;
  filePath: string;
  previewUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAssetDocument extends IAsset, Document {}

const AssetSchema = new Schema<IAssetDocument>({
  type: { type: String, enum: ['image', 'icon', 'logo'], required: true, index: true },
  filePath: { type: String, required: true },
  previewUrl: { type: String },
}, { timestamps: true });

export default model<IAssetDocument>('Asset', AssetSchema);
