import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ConfigPanel } from './ConfigPanel';
import { SessionStats } from './SessionStats';

export type SessionType = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroConfig {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export const PomodoroTimer: React.FC = () => {
  const [config, setConfig] = useState<PomodoroConfig>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  });

  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [timeRemaining, setTimeRemaining] = useState<number>(config.workDuration * 60); // in seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on mount
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    
    // We'll use a data URI for a simple notification sound
    audioRef.current = new Audio();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    playNotificationSound();
    
    if (sessionType === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      // Determine next break type
      if (newCompletedSessions % config.sessionsUntilLongBreak === 0) {
        setSessionType('longBreak');
        setTimeRemaining(config.longBreakDuration * 60);
      } else {
        setSessionType('shortBreak');
        setTimeRemaining(config.shortBreakDuration * 60);
      }
    } else {
      // After any break, go back to work
      setSessionType('work');
      setTimeRemaining(config.workDuration * 60);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    const duration = sessionType === 'work' 
      ? config.workDuration 
      : sessionType === 'shortBreak' 
      ? config.shortBreakDuration 
      : config.longBreakDuration;
    setTimeRemaining(duration * 60);
  };

  const handleConfigSave = (newConfig: PomodoroConfig) => {
    setConfig(newConfig);
    setShowConfig(false);
    
    // Reset timer with new configuration
    setIsRunning(false);
    const duration = sessionType === 'work' 
      ? newConfig.workDuration 
      : sessionType === 'shortBreak' 
      ? newConfig.shortBreakDuration 
      : newConfig.longBreakDuration;
    setTimeRemaining(duration * 60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    const totalDuration = sessionType === 'work' 
      ? config.workDuration * 60
      : sessionType === 'shortBreak' 
      ? config.shortBreakDuration * 60
      : config.longBreakDuration * 60;
    return ((totalDuration - timeRemaining) / totalDuration) * 100;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">Pomodoro Timer</h1>
          <p className="text-slate-600">Stay focused and productive</p>
        </div>

        {/* Session Stats */}
        <SessionStats 
          sessionType={sessionType} 
          completedSessions={completedSessions}
          sessionsUntilLongBreak={config.sessionsUntilLongBreak}
        />

        {/* Main Timer Card */}
        <Card className="p-8 shadow-xl bg-white/90 backdrop-blur-sm border-slate-300">
          <div className="space-y-6">
            {/* Circular Progress */}
            <div className="relative flex items-center justify-center">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="#cbd5e1"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke={sessionType === 'work' ? '#475569' : '#64748b'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - getProgress() / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-slate-800 font-mono">
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {!isRunning ? (
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="w-32 gap-2 bg-slate-700 hover:bg-slate-800"
                >
                  <Play className="w-5 h-5" />
                  Start
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handlePause}
                  variant="secondary"
                  className="w-32 gap-2 bg-slate-500 hover:bg-slate-600 text-white"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </Button>
              )}
              
              <Button
                size="lg"
                onClick={handleReset}
                variant="outline"
                className="gap-2 border-slate-400 text-slate-700 hover:bg-slate-100"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </Button>
              
              <Button
                size="lg"
                onClick={() => setShowConfig(true)}
                variant="outline"
                className="gap-2 border-slate-400 text-slate-700 hover:bg-slate-100"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-4 bg-white/60 backdrop-blur-sm border-slate-300">
          <div className="text-sm text-slate-700 space-y-1">
            <p><strong>How it works:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Work for {config.workDuration} minutes</li>
              <li>Take a {config.shortBreakDuration} minute break</li>
              <li>After {config.sessionsUntilLongBreak} sessions, take a {config.longBreakDuration} minute break</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Config Dialog */}
      {showConfig && (
        <ConfigPanel
          config={config}
          onSave={handleConfigSave}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
};