import { Request, Response } from 'express';
import { FinancialRecord, RecordType } from '../models/FinancialRecord';

export const getDashboardSummary = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const summary = await FinancialRecord.aggregate([
    { $match: { userId: userId } }, // This needs to be ObjectId in a real scenario, but Mongoose aggregate sometimes string matches fail. Let's fix.
  ]);

  // Fallback to simple query if aggregate is tricky with types
  const records = await FinancialRecord.find({ userId });
  
  // Sort descending by date and grab the top 5 for recent activity
  const recentActivity = [...records].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  let totalIncome = 0;
  let totalExpense = 0;
  
  const categorySummary: Record<string, number> = {};
  const monthlyTrends: Record<string, { income: number; expense: number }> = {};

  records.forEach((record) => {
    if (record.type === RecordType.INCOME) {
      totalIncome += record.amount;
    } else {
      totalExpense += record.amount;
    }

    if (record.type === RecordType.EXPENSE) {
      if (!categorySummary[record.category]) {
        categorySummary[record.category] = 0;
      }
      categorySummary[record.category] += record.amount;
    }

    const monthYear = `${record.date.getFullYear()}-${String(record.date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyTrends[monthYear]) {
      monthlyTrends[monthYear] = { income: 0, expense: 0 };
    }
    
    if (record.type === RecordType.INCOME) {
      monthlyTrends[monthYear].income += record.amount;
    } else {
      monthlyTrends[monthYear].expense += record.amount;
    }
  });

  const categoryData = Object.entries(categorySummary).map(([name, value]) => ({ name, value }));
  const trendsData = Object.entries(monthlyTrends).map(([date, data]) => ({ date, ...data })).sort((a, b) => a.date.localeCompare(b.date));

  res.json({
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    categoryData,
    trendsData,
    recentActivity,
  });
};
