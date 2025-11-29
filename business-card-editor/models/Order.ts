import { Schema, model, Document, Types } from 'mongoose';

export type OrderStatus = 'pending' | 'paid' | 'printing' | 'shipped' | 'completed' | 'cancelled';

export interface IAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
}

export interface IOrder {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  quantity: number;
  status: OrderStatus;
  address: IAddress;
  paymentInfo?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderDocument extends IOrder, Document {}

const AddressSchema = new Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

const OrderSchema = new Schema<IOrderDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ['pending', 'paid', 'printing', 'shipped', 'completed', 'cancelled'], default: 'pending', index: true },
  address: { type: AddressSchema, required: true },
  paymentInfo: { type: Schema.Types.Mixed },
}, { timestamps: true });

export default model<IOrderDocument>('Order', OrderSchema);
