import { Request, Response } from 'express';
import { FinancialRecord } from '../models/FinancialRecord';
import { UserRole } from '../models/User';

export const getRecords = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { type, category, startDate, endDate } = req.query;

  let query: any = {};

  if (user.role === UserRole.VIEWER) {
    query.userId = user.id;
  } else if (req.query.userId) {
    query.userId = req.query.userId;
  }

  if (type) query.type = type;
  if (category) {
    query.category = { $regex: category, $options: 'i' };
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate as string);
    if (endDate) query.date.$lte = new Date(endDate as string);
  }

  let sortQuery: any = { date: -1, createdAt: -1 };
  if (req.query.sortAmount === 'asc') sortQuery = { amount: 1 };
  else if (req.query.sortAmount === 'desc') sortQuery = { amount: -1 };

  const records = await FinancialRecord.find(query).populate('userId', 'name email').sort(sortQuery);
  res.json(records);
};

export const createRecord = async (req: Request, res: Response) => {
  const { amount, type, category, date, notes } = req.body;

  const record = await FinancialRecord.create({
    userId: (req as any).user.id,
    amount,
    type,
    category,
    date,
    notes,
  });

  res.status(201).json(record);
};

export const updateRecord = async (req: Request, res: Response) => {
  const record = await FinancialRecord.findById(req.params.id);

  if (!record) {
    res.status(404).json({ message: 'Record not found' });
    return;
  }

  if (record.userId.toString() !== (req as any).user.id && (req as any).user.role !== UserRole.ADMIN) {
    res.status(401).json({ message: 'User not authorized' });
    return;
  }

  const updatedRecord = await FinancialRecord.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updatedRecord);
};

export const deleteRecord = async (req: Request, res: Response) => {
  const record = await FinancialRecord.findById(req.params.id);

  if (!record) {
    res.status(404).json({ message: 'Record not found' });
    return;
  }

  if (record.userId.toString() !== (req as any).user.id && (req as any).user.role !== UserRole.ADMIN) {
    res.status(401).json({ message: 'User not authorized' });
    return;
  }

  await record.deleteOne();

  res.json({ id: req.params.id });
};
