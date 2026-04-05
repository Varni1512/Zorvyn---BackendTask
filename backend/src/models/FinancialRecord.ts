import mongoose, { Document, Schema } from 'mongoose';

export enum RecordType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

export interface IFinancialRecord extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const financialRecordSchema = new Schema<IFinancialRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: Object.values(RecordType), required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const FinancialRecord = mongoose.model<IFinancialRecord>('FinancialRecord', financialRecordSchema);
