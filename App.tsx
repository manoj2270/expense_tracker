import React, { useState, useEffect } from 'react';
import { ScreenAdd } from './components/ScreenAdd';
import { ScreenAnalysis } from './components/ScreenAnalysis';
import { BottomNav } from './components/BottomNav';
import { Transaction } from './types';
import { saveTransactions, loadTransactions } from './services/storageService';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'add' | 'analysis'>('add');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load on mount
  useEffect(() => {
    const loaded = loadTransactions();
    // Sort by date descending
    setTransactions(loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  // Save on change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const handleAddTransaction = (newTxData: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setTransactions(prev => [newTx, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleDeleteTransaction = (id: string) => {
    if(window.confirm('Delete this transaction?')) {
        setTransactions(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-50 flex justify-center">
      {/* Mobile container - max width for desktop viewing comfort */}
      <div className="w-full max-w-md h-full bg-white relative shadow-2xl overflow-hidden flex flex-col">
        
        <main className="flex-1 overflow-hidden relative">
          {currentScreen === 'add' ? (
            <ScreenAdd 
              onAddTransaction={handleAddTransaction} 
              recentTransactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          ) : (
            <ScreenAnalysis transactions={transactions} />
          )}
        </main>

        <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </div>
    </div>
  );
}

export default App;