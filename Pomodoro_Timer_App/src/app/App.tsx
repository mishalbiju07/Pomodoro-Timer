import React, { useState } from 'react';
import { Timer, Clock, TimerReset, AlarmClock, Calendar } from 'lucide-react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { WorldClocks } from './components/WorldClocks';
import { Stopwatch } from './components/Stopwatch';
import { CountdownTimer } from './components/CountdownTimer';
import { DailyPlanner } from './components/DailyPlanner';
import { Card } from './components/ui/card';

type View = 'pomodoro' | 'worldClock' | 'stopwatch' | 'timer' | 'planner';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('pomodoro');

  const navItems = [
    { id: 'pomodoro' as View, label: 'Pomodoro', icon: Timer },
    { id: 'worldClock' as View, label: 'World Clock', icon: Clock },
    { id: 'stopwatch' as View, label: 'Stopwatch', icon: TimerReset },
    { id: 'timer' as View, label: 'Timer', icon: AlarmClock },
    { id: 'planner' as View, label: 'Planner', icon: Calendar },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'worldClock':
        return <WorldClocks />;
      case 'stopwatch':
        return <Stopwatch />;
      case 'timer':
        return <CountdownTimer />;
      case 'planner':
        return <DailyPlanner />;
      default:
        return <PomodoroTimer />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-gray-50 to-slate-200">
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-800 shadow-lg">
        <div className="flex overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex-1 min-w-max px-4 py-3 flex flex-col items-center gap-1 transition-colors ${
                  currentView === item.id
                    ? 'text-slate-100 bg-slate-700 border-b-2 border-slate-400'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-slate-800 shadow-2xl z-50">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Productivity Hub</h1>
          <p className="text-sm text-slate-400">Time management tools</p>
        </div>
        
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-slate-700 text-slate-100 font-medium shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Info Card */}
        <div className="absolute bottom-6 left-3 right-3">
          <Card className="p-4 bg-slate-700 border-slate-600">
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-200 text-sm">💡 Tip</h3>
              <p className="text-xs text-slate-400">
                Use keyboard shortcuts: Space to start/pause timers, R to reset.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 pt-20 md:pt-0">
        {renderView()}
      </div>
    </div>
  );
}