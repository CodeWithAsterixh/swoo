import { Schema, Document } from 'mongoose';

export type ElementType = 'text' | 'image' | 'shape';

export interface IElement {
  id: string;
  type: ElementType;
  content?: string; // for text content
  src?: string; // image source
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  style?: {
    // text styles
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: 'normal' | 'italic' | 'oblique';
    fontWeight?: string | number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: number;
    letterSpacing?: number;
    textDecoration?: 'none' | 'underline' | 'line-through';
    color?: string;

    // border / stroke
    stroke?: string;
    strokeWidth?: number;

    // box styles
    borderRadius?: number;
    // shape-specific
    shape?: 'rect' | 'oval' | 'line';
    fill?: string;
  };
  parentId?: string | null;
  zIndex: number;
}

export interface IElementDocument extends IElement, Document {}

export const ElementSchema = new Schema<IElementDocument>({
  id: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String },
  src: { type: String },
  position: {
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
  },
  size: {
    width: { type: Number, required: true, default: 100 },
    height: { type: Number, required: true, default: 40 },
  },
  rotation: { type: Number, default: 0 },
  style: { type: Schema.Types.Mixed, default: {} },
  parentId: { type: String, default: null },
  zIndex: { type: Number, default: 0 },
});
