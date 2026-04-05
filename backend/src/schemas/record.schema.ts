import { z } from 'zod';
import { RecordType } from '../models/FinancialRecord';

export const createRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    type: z.nativeEnum(RecordType),
    category: z.string().min(1, 'Category is required'),
    date: z.string().pipe(z.coerce.date()),
    notes: z.string().optional(),
  }),
});

export const updateRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.nativeEnum(RecordType).optional(),
    category: z.string().min(1).optional(),
    date: z.string().pipe(z.coerce.date()).optional(),
    notes: z.string().optional(),
  }),
});
