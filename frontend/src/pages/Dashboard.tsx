import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, IndianRupee, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
  
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/dashboard');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const { totalIncome = 0, totalExpense = 0, balance = 0, categoryData = [], trendsData = [], recentActivity = [] } = data || {};

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-4">
            <h3 className="font-medium">Total Balance</h3>
            <IndianRupee className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">₹{balance.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Available funds</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-4">
            <h3 className="font-medium">Total Income</h3>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">₹{totalIncome.toLocaleString()}</p>
            <p className="text-sm text-green-600 font-medium mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> Trending up</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-4">
            <h3 className="font-medium">Total Expenses</h3>
            <ArrowDownRight className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">₹{totalExpense.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Total spend</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Income vs Expense Trends</h3>
          <div className="h-96 w-full pb-4">
            {trendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '0px', border: '1px solid #e4e4e7', boxShadow: 'none' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="Expense" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No trend data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Expense Categories</h3>
          <div className="h-96 w-full pb-6">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_entry: { name: string; value: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number | string | readonly (string | number)[] | undefined) => `₹${value}`}
                    contentStyle={{ borderRadius: '0px', border: '1px solid #e4e4e7', boxShadow: 'none' }}
                  />
                  <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No category data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-medium text-sm">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Type</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.length > 0 ? (
                recentActivity.map((record: any) => (
                  <tr key={record._id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-700">{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{record.category}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{record.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-3 py-1 rounded-full text-xs font-semibold select-none border",
                        record.type === 'Income' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {record.type}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No recent activity detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
