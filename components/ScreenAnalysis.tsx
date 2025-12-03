import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import { Filter, Sparkles, AlertCircle, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Transaction, FilterState, ChartDataPoint } from '../types';
import { Button } from './Button';
import { getSpendingAnalysis } from '../services/geminiService';

interface ScreenAnalysisProps {
  transactions: Transaction[];
}

// Expanded color palette for more categories
const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f97316', // orange
  '#10b981', // emerald
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#64748b', // slate
  '#ef4444', // red
  '#eab308', // yellow
  '#06b6d4', // cyan
  '#d946ef', // fuchsia
  '#84cc16', // lime
  '#f43f5e', // rose
];

export const ScreenAnalysis: React.FC<ScreenAnalysisProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<FilterState>({
    range: 'month',
    customStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    customEnd: new Date().toISOString().split('T')[0]
  });
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    const today = new Date();
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      if (filter.range === 'month') {
        return tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear();
      } else if (filter.range === 'year') {
        return tDate.getFullYear() === today.getFullYear();
      } else {
        const start = new Date(filter.customStart);
        const end = new Date(filter.customEnd);
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);
        return tDate >= start && tDate <= end;
      }
    });
  }, [transactions, filter]);

  // Calculations
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // Chart Data (Expenses Only for breakdown)
  const expenseData: ChartDataPoint[] = useMemo(() => {
    const map = new Map<string, number>();
    filteredTransactions.filter(t => t.type === 'expense').forEach(e => {
      map.set(e.category, (map.get(e.category) || 0) + e.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filteredTransactions]);

  const handleAiAnalyze = async () => {
    setIsAnalyzing(true);
    const context = filter.range === 'custom' ? `From ${filter.customStart} to ${filter.customEnd}` : `Current ${filter.range}`;
    const result = await getSpendingAnalysis(filteredTransactions, context);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded border border-gray-100 text-xs z-50">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-blue-600">₹{payload[0].value?.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="px-6 pt-8 pb-4 bg-white sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Analysis</h1>
        <p className="text-gray-500 text-sm">Visual financial report</p>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 p-6 space-y-6">
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
            <Filter className="w-4 h-4" /> Filter By
          </div>
          <div className="flex gap-2 mb-3">
            {(['month', 'year', 'custom'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilter(prev => ({ ...prev, range: r }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter.range === r 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          
          {filter.range === 'custom' && (
             <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div>
                   <label className="text-xs text-gray-500 block mb-1">Start</label>
                   <input 
                      type="date" 
                      value={filter.customStart}
                      onChange={(e) => setFilter(prev => ({...prev, customStart: e.target.value}))}
                      className="w-full text-sm bg-gray-50 border border-gray-200 rounded p-2"
                   />
                </div>
                <div>
                   <label className="text-xs text-gray-500 block mb-1">End</label>
                   <input 
                      type="date" 
                      value={filter.customEnd}
                      onChange={(e) => setFilter(prev => ({...prev, customEnd: e.target.value}))}
                      className="w-full text-sm bg-gray-50 border border-gray-200 rounded p-2"
                   />
                </div>
             </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex flex-col items-center justify-center text-center">
                <span className="text-green-600 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                   <TrendingUp className="w-3 h-3" /> Income
                </span>
                <span className="text-green-700 font-bold text-sm">₹{totalIncome.toFixed(0)}</span>
            </div>
            <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex flex-col items-center justify-center text-center">
                <span className="text-red-600 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                   <TrendingDown className="w-3 h-3" /> Expense
                </span>
                <span className="text-red-700 font-bold text-sm">₹{totalExpense.toFixed(0)}</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
                <span className="text-blue-600 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                   <Wallet className="w-3 h-3" /> Balance
                </span>
                <span className="text-blue-700 font-bold text-sm">₹{balance.toFixed(0)}</span>
            </div>
        </div>

        {/* Charts Section */}
        {filteredTransactions.length > 0 ? (
          <>
            {/* Pie Chart */}
            {expenseData.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        >
                        {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {expenseData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="truncate">{entry.name}</span>
                        <span className="ml-auto font-mono">₹{entry.value}</span>
                        </div>
                    ))}
                </div>
                </div>
            )}

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-sm border border-indigo-100">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                     <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-900">AI Insights</h3>
                        <p className="text-xs text-indigo-600/80">Powered by Gemini</p>
                     </div>
                  </div>
                  {!aiAnalysis && (
                     <Button 
                       variant="primary" 
                       onClick={handleAiAnalyze} 
                       isLoading={isAnalyzing}
                       className="text-xs py-2 px-3 h-auto"
                     >
                       Analyze
                     </Button>
                  )}
               </div>
               
               {aiAnalysis ? (
                 <div className="prose prose-sm prose-indigo max-w-none bg-white/50 p-4 rounded-xl">
                    <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{aiAnalysis}</p>
                    <button 
                       onClick={() => setAiAnalysis(null)} 
                       className="text-xs text-indigo-500 underline mt-2 hover:text-indigo-700"
                    >
                       Clear & Refresh
                    </button>
                 </div>
               ) : (
                 <p className="text-sm text-gray-500 italic">
                    Tap analyze to get personalized financial advice based on your current data.
                 </p>
               )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
             <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
             <p>No transactions found for this period.</p>
          </div>
        )}

      </div>
    </div>
  );
};