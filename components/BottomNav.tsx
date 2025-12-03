import React from 'react';
import { PlusCircle, BarChart3 } from 'lucide-react';

interface BottomNavProps {
  currentScreen: 'add' | 'analysis';
  onNavigate: (screen: 'add' | 'analysis') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => onNavigate('add')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            currentScreen === 'add' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <PlusCircle className={`w-6 h-6 ${currentScreen === 'add' ? 'fill-blue-100' : ''}`} />
          <span className="text-xs font-medium">Add</span>
        </button>

        <div className="w-px h-8 bg-gray-100"></div>

        <button
          onClick={() => onNavigate('analysis')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            currentScreen === 'analysis' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <BarChart3 className={`w-6 h-6 ${currentScreen === 'analysis' ? 'fill-blue-100' : ''}`} />
          <span className="text-xs font-medium">Analysis</span>
        </button>
      </div>
    </div>
  );
};
