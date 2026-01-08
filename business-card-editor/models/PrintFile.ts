import { Schema, model, Document, Types } from 'mongoose';

export interface IPrintFile {
  projectId: Types.ObjectId;
  filePath: string;
  metadata?: {
    dpi?: number;
    bleed?: number;
    pages?: number;
    cmyk?: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPrintFileDocument extends IPrintFile, Document {}

const PrintFileSchema = new Schema<IPrintFileDocument>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  filePath: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

export default model<IPrintFileDocument>('PrintFile', PrintFileSchema);
