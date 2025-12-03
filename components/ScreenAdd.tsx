import React, { useState } from 'react';
import { Plus, Calendar, Tag, MessageSquare, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Transaction, TransactionType, ExpenseCategory, IncomeCategory } from '../types';
import { Button } from './Button';

interface ScreenAddProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  recentTransactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const ScreenAdd: React.FC<ScreenAddProps> = ({ onAddTransaction, recentTransactions, onDeleteTransaction }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<string>(ExpenseCategory.FOOD);
  const [note, setNote] = useState('');

  // Update category default when type changes
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'expense' ? ExpenseCategory.FOOD : IncomeCategory.SALARY);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    onAddTransaction({
      amount: parseFloat(amount),
      date,
      category,
      type,
      note
    });

    // Reset form mostly, keep date
    setAmount('');
    setNote('');
  };

  // Helper for dynamic category styling
  const getCategoryStyles = (category: string, type: TransactionType) => {
    if (type === 'income') return 'bg-green-100 text-green-600';
    
    switch (category) {
        case ExpenseCategory.FOOD: return 'bg-orange-100 text-orange-600';
        case ExpenseCategory.GROCERIES: return 'bg-yellow-100 text-yellow-600';
        case ExpenseCategory.TRANSPORT: return 'bg-blue-100 text-blue-600';
        case ExpenseCategory.BILLS: return 'bg-red-100 text-red-600';
        case ExpenseCategory.SHOPPING: return 'bg-purple-100 text-purple-600';
        case ExpenseCategory.HEALTH: return 'bg-teal-100 text-teal-600';
        case ExpenseCategory.HOUSING: return 'bg-indigo-100 text-indigo-600';
        case ExpenseCategory.ENTERTAINMENT: return 'bg-pink-100 text-pink-600';
        case ExpenseCategory.TRAVEL: return 'bg-sky-100 text-sky-600';
        case ExpenseCategory.EDUCATION: return 'bg-cyan-100 text-cyan-600';
        case ExpenseCategory.INVESTMENT: return 'bg-emerald-100 text-emerald-600';
        case ExpenseCategory.DEBT: return 'bg-rose-100 text-rose-600';
        default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="px-6 pt-8 pb-4 bg-white sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Add Transaction</h1>
        <p className="text-gray-500 text-sm">Track your daily finances</p>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Type Toggle */}
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" /> Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" /> Income
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-2xl text-gray-400 font-serif">₹</span>
              </div>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-12 pr-4 py-4 bg-white border rounded-2xl text-3xl font-semibold focus:ring-2 outline-none transition-shadow ${
                    type === 'expense' ? 'text-red-600 border-red-100 focus:ring-red-500' : 'text-green-600 border-green-100 focus:ring-green-500'
                }`}
              />
            </div>
          </div>

          {/* Date & Category Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  style={{ minHeight: '48px' }} // Ensure clickability
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                  {type === 'expense' 
                    ? Object.values(ExpenseCategory).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    : Object.values(IncomeCategory).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                  }
                </select>
              </div>
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Message (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What was this for?"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className={`w-full text-white shadow-lg ${type === 'expense' ? 'bg-black hover:bg-gray-800' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}
          >
            <Plus className="w-5 h-5 mr-2" />
            {type === 'expense' ? 'Add Expense' : 'Add Income'}
          </Button>

        </form>

        {/* Recent Transactions Mini List */}
        <div className="px-6 mt-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent</h2>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4 italic">No transactions yet.</p>
            ) : (
              recentTransactions.slice(0, 5).map((t) => (
                <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getCategoryStyles(t.category, t.type)}`}>
                      {t.type === 'income' ? <ArrowUpCircle className="w-5 h-5"/> : t.category[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{t.category}</p>
                      <p className="text-xs text-gray-500">{t.note || t.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                    </span>
                    <button 
                      onClick={() => onDeleteTransaction(t.id)}
                      className="text-gray-300 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};