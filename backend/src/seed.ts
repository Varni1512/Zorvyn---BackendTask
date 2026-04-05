import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { User, UserRole } from './models/User';
import { FinancialRecord, RecordType } from './models/FinancialRecord';
import { connectDB } from './config/db';

dotenv.config();

const generateDateInPastMonths = (monthsAgo: number, day: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(day);
  return date;
};

const generateRecordsForUser = (userId: mongoose.Types.ObjectId, baseIncome: number, baseRent: number) => {
  const records = [];
  for (let i = 5; i >= 0; i--) {
    // Income
    records.push({ userId, amount: baseIncome, type: RecordType.INCOME, category: 'Salary', date: generateDateInPastMonths(i, 1) });
    if (Math.random() > 0.3) {
      records.push({ userId, amount: Math.floor(baseIncome * 0.2) + Math.floor(Math.random() * 800), type: RecordType.INCOME, category: 'Freelance', date: generateDateInPastMonths(i, 15) });
    }

    // Rent
    records.push({ userId, amount: baseRent, type: RecordType.EXPENSE, category: 'Housing', date: generateDateInPastMonths(i, 3) });
    
    // Utilities
    records.push({ userId, amount: 200 + Math.floor(Math.random() * 50), type: RecordType.EXPENSE, category: 'Utilities', date: generateDateInPastMonths(i, 5) });
    
    // Groceries
    records.push({ userId, amount: 150 + Math.floor(Math.random() * 100), type: RecordType.EXPENSE, category: 'Food & Groceries', date: generateDateInPastMonths(i, 8) });
    records.push({ userId, amount: 150 + Math.floor(Math.random() * 100), type: RecordType.EXPENSE, category: 'Food & Groceries', date: generateDateInPastMonths(i, 18) });
    records.push({ userId, amount: 100 + Math.floor(Math.random() * 100), type: RecordType.EXPENSE, category: 'Food & Groceries', date: generateDateInPastMonths(i, 25) });

    // Entertainment
    records.push({ userId, amount: 80 + Math.floor(Math.random() * 100), type: RecordType.EXPENSE, category: 'Entertainment', date: generateDateInPastMonths(i, 10) });
    records.push({ userId, amount: 60 + Math.floor(Math.random() * 80), type: RecordType.EXPENSE, category: 'Entertainment', date: generateDateInPastMonths(i, 22) });

    // Transport
    records.push({ userId, amount: 50 + Math.floor(Math.random() * 40), type: RecordType.EXPENSE, category: 'Transportation', date: generateDateInPastMonths(i, 12) });
    records.push({ userId, amount: 50 + Math.floor(Math.random() * 40), type: RecordType.EXPENSE, category: 'Transportation', date: generateDateInPastMonths(i, 28) });

    // Shopping
    if (Math.random() > 0.4) {
      records.push({ userId, amount: 150 + Math.floor(Math.random() * 300), type: RecordType.EXPENSE, category: 'Shopping', date: generateDateInPastMonths(i, 16) });
    }
  }
  return records;
};

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await FinancialRecord.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@zoryn.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    const analystUser = await User.create({
      name: 'Analyst User',
      email: 'analyst@zoryn.com',
      password: hashedPassword,
      role: UserRole.ANALYST,
    });

    const viewerUser = await User.create({
      name: 'Viewer User',
      email: 'viewer@zoryn.com',
      password: hashedPassword,
      role: UserRole.VIEWER,
    });

    // Create records for all three users
    const allRecords = [
      ...generateRecordsForUser(adminUser._id, 6500, 1800),
      ...generateRecordsForUser(analystUser._id, 4500, 1200),
      ...generateRecordsForUser(viewerUser._id, 3200, 900),
    ];

    await FinancialRecord.insertMany(allRecords);

    console.log('Rich Database Seeded successfully for all users!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

seedData();
