import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { FinancialRecord, RecordType } from '../models/FinancialRecord';
import { UserRole } from '../models/User';

export const getDashboardSummary = async (req: Request, res: Response) => {
  const user = (req as any).user;
  let matchQuery: any = {};

  if (user.role === UserRole.VIEWER) {
    matchQuery.userId = new mongoose.Types.ObjectId(user.id);
  } else if (req.query.userId) {
    matchQuery.userId = new mongoose.Types.ObjectId(req.query.userId as string);
  }

  try {
    const summaryFacet = await FinancialRecord.aggregate([
      { $match: matchQuery },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: '$type',
                totalAmount: { $sum: '$amount' },
              },
            },
          ],
          categories: [
            { $match: { type: RecordType.EXPENSE } },
            {
              $group: {
                _id: '$category',
                value: { $sum: '$amount' },
              },
            },
            {
              $project: {
                name: '$_id',
                value: 1,
                _id: 0,
              },
            },
          ],
          trends: [
            {
              $group: {
                _id: {
                  year: { $year: '$date' },
                  month: { $month: '$date' },
                  type: '$type',
                },
                totalAmount: { $sum: '$amount' },
              },
            },
          ],
          recent: [
            { $sort: { date: -1 } },
            { $limit: 5 },
          ],
        },
      },
    ]);

    const result = summaryFacet[0];

    let totalIncome = 0;
    let totalExpense = 0;
    
    result.totals.forEach((t: any) => {
      if (t._id === RecordType.INCOME) totalIncome = t.totalAmount;
      if (t._id === RecordType.EXPENSE) totalExpense = t.totalAmount;
    });

    const monthlyTrends: Record<string, { income: number; expense: number }> = {};
    
    result.trends.forEach((t: any) => {
      const monthStr = String(t._id.month).padStart(2, '0');
      const dateKey = `${t._id.year}-${monthStr}`;
      
      if (!monthlyTrends[dateKey]) {
        monthlyTrends[dateKey] = { income: 0, expense: 0 };
      }
      
      if (t._id.type === RecordType.INCOME) {
        monthlyTrends[dateKey].income += t.totalAmount;
      } else {
        monthlyTrends[dateKey].expense += t.totalAmount;
      }
    });

    const trendsData = Object.entries(monthlyTrends)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryData: result.categories,
      trendsData,
      recentActivity: result.recent,
    });
  } catch (error) {
    console.error('Aggregation error:', error);
    res.status(500).json({ message: 'Error aggregating dashboard data' });
  }
};
