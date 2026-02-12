import React from 'react';
import { SessionType } from './PomodoroTimer';
import { Coffee, Briefcase, Sofa } from 'lucide-react';
import { Card } from './ui/card';

interface SessionStatsProps {
  sessionType: SessionType;
  completedSessions: number;
  sessionsUntilLongBreak: number;
}

export const SessionStats: React.FC<SessionStatsProps> = ({ 
  sessionType, 
  completedSessions,
  sessionsUntilLongBreak 
}) => {
  const getSessionInfo = () => {
    switch (sessionType) {
      case 'work':
        return {
          label: 'Work Session',
          icon: <Briefcase className="w-6 h-6" />,
          color: 'text-slate-700 bg-slate-200',
        };
      case 'shortBreak':
        return {
          label: 'Short Break',
          icon: <Coffee className="w-6 h-6" />,
          color: 'text-slate-600 bg-slate-100',
        };
      case 'longBreak':
        return {
          label: 'Long Break',
          icon: <Sofa className="w-6 h-6" />,
          color: 'text-slate-500 bg-slate-100',
        };
    }
  };

  const sessionInfo = getSessionInfo();
  const sessionsInCycle = completedSessions % sessionsUntilLongBreak;

  return (
    <Card className="p-6 space-y-4 bg-white/90 backdrop-blur-sm border-slate-300">
      {/* Current Session Type */}
      <div className="flex items-center justify-center gap-3">
        <div className={`p-3 rounded-full ${sessionInfo.color}`}>
          {sessionInfo.icon}
        </div>
        <div>
          <p className="text-sm text-slate-500">Current Session</p>
          <p className="text-xl font-semibold text-slate-800">{sessionInfo.label}</p>
        </div>
      </div>

      {/* Session Counter */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-slate-800">{completedSessions}</p>
          <p className="text-sm text-slate-500">Completed Sessions</p>
        </div>
        
        <div className="h-12 w-px bg-slate-300"></div>
        
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-1 mb-1">
            {Array.from({ length: sessionsUntilLongBreak }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < sessionsInCycle ? 'bg-slate-600' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500">Progress to Long Break</p>
        </div>
      </div>
    </Card>
  );
};