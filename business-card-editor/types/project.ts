import type { IElement } from '../models/Element';

export type Element = IElement;

export type Page = {
  id?: string;
  elements: Element[];
};

export type CanvasMeta = {
  width: number;
  height: number;
  backgroundColor?: string;
};

export type ProjectType = {
  _id?: string;
  id?: string;
  userId?: string;
  templateId?: string | null;
  name: string;
  canvas: CanvasMeta;
  pages: Page[];
  status?: 'draft' | 'saved' | 'submitted' | 'completed';
  createdAt?: string;
  updatedAt?: string;
};

export type NewElementInput = Partial<Omit<Element, 'id'>> & { id?: string };

export type TemplateType = {
  name: string;
  thumbnail?: string;
  elements: Element[];
  metadata?: Record<string, any>;
};
