import { IElement } from '../models/Element';

export interface Page {
  id: string;
  elements: IElement[];
  width: number;
  height: number;
}

export interface ProjectType {
  _id?: string;
  name: string;
  pages: Page[];
  createdAt?: string;
  updatedAt?: string;
}
