import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import api from '../services/api';
import { useAuth } from '../store/auth';
import { Plus, Trash2, Edit2, Filter } from 'lucide-react';
import clsx from 'clsx';

const recordSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['Income', 'Expense']),
  category: z.string().min(1),
  date: z.string(),
  notes: z.string().optional(),
});

type RecordForm = z.infer<typeof recordSchema>;

const Records = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  });
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RecordForm>({
    resolver: zodResolver(recordSchema),
    defaultValues: { type: 'Expense', date: new Date().toISOString().split('T')[0] }
  });

  const { data: records, isLoading } = useQuery({
    queryKey: ['records', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get(`/records?${params.toString()}`);
      return response.data;
    },
  });

  const createRecord = useMutation({
    mutationFn: async (newRecord: RecordForm) => {
      await api.post('/records', newRecord);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      handleCloseModal();
    },
  });

  const updateRecord = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RecordForm }) => {
      await api.put(`/records/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      handleCloseModal();
    },
  });

  const deleteRecord = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/records/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });

  const canEdit = user?.role === 'Admin';

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset({ type: 'Expense', date: new Date().toISOString().split('T')[0], category: '', amount: undefined, notes: '' });
  };

  const handleEditClick = (record: any) => {
    setEditingId(record._id);
    reset({
      type: record.type,
      category: record.category,
      amount: record.amount,
      date: new Date(record.date).toISOString().split('T')[0],
      notes: record.notes || ''
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: RecordForm) => {
    if (editingId) {
      updateRecord.mutate({ id: editingId, data });
    } else {
      createRecord.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Records</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and filter your transactions</p>
        </div>
        
        {canEdit && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-zinc-800 transition"
          >
            <Plus className="w-5 h-5" />
            Add Record
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-200 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex items-center gap-2 text-zinc-500 font-medium">
          <Filter className="w-4 h-4" /> Filters:
        </div>
        <div>
          <select 
            value={filters.type} 
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div>
          <input 
            type="text" 
            placeholder="Category..." 
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[150px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="date" 
            value={filters.startDate}
            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            className="px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="text-zinc-500 text-sm">to</span>
          <input 
            type="date" 
            value={filters.endDate}
            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            className="px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        {(filters.type || filters.category || filters.startDate || filters.endDate) && (
          <button 
            onClick={() => setFilters({ type: '', category: '', startDate: '', endDate: '' })}
            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-transparent"
          >
            Clear
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium text-sm">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Notes</th>
                {canEdit && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No financial records found. Add your first record.
                  </td>
                </tr>
              ) : (
                records?.map((record: { _id: string, date: string, type: string, category: string, amount: number, notes?: string }) => (
                  <tr key={record._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-700">{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-3 py-1 rounded-full text-xs font-semibold select-none border",
                        record.type === 'Income' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{record.category}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold">₹{record.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{record.notes || '-'}</td>
                    {canEdit && (
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(record)}
                          className="text-zinc-400 hover:text-emerald-600 p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteRecord.mutate(record._id)}
                          className="text-zinc-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Basic Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Record' : 'Add New Record'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select {...register('type')} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900">
                      <option value="Expense">Expense</option>
                      <option value="Income">Income</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" {...register('date')} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900" placeholder="0.00" />
                  {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" {...register('category')} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900" placeholder="e.g. Salary, Utilities, Food" />
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea {...register('notes')} className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 resize-none" rows={3} placeholder="Add any extra details..."></textarea>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-medium hover:bg-zinc-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={createRecord.isPending || updateRecord.isPending} className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition disabled:opacity-70">
                  {createRecord.isPending || updateRecord.isPending ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
