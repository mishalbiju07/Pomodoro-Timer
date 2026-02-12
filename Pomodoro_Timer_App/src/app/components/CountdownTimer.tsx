import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

export const CountdownTimer: React.FC = () => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(5);
  const [seconds, setSeconds] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSetup, setIsSetup] = useState<boolean>(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            playNotificationSound();
            setIsRunning(false);
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
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    }
  };

  const handleStart = () => {
    if (isSetup) {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total > 0) {
        setTotalSeconds(total);
        setTimeRemaining(total);
        setIsSetup(false);
        setIsRunning(true);
      }
    } else {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsSetup(true);
    setTimeRemaining(0);
    setTotalSeconds(0);
  };

  const formatTime = (secs: number): string => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (totalSeconds === 0) return 0;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };

  const handleInputChange = (value: string, setter: React.Dispatch<React.SetStateAction<number>>, max: number) => {
    const num = parseInt(value, 10);
    if (value === '') {
      setter(0);
    } else if (!isNaN(num) && num >= 0 && num <= max) {
      setter(num);
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">Countdown Timer</h1>
          <p className="text-slate-600">Set a custom countdown timer</p>
        </div>

        {/* Main Timer Card */}
        <Card className="p-8 shadow-xl bg-white/90 backdrop-blur-sm border-slate-300">
          <div className="space-y-8">
            {isSetup ? (
              // Setup Mode
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-700 mb-6">Set Timer Duration</h3>
                  <div className="flex items-center justify-center gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-600">Hours</Label>
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={hours}
                        onChange={(e) => handleInputChange(e.target.value, setHours, 23)}
                        className="w-20 text-center text-2xl font-mono border-slate-300"
                      />
                    </div>
                    <span className="text-3xl font-bold text-slate-400 mt-6">:</span>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-600">Minutes</Label>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={minutes}
                        onChange={(e) => handleInputChange(e.target.value, setMinutes, 59)}
                        className="w-20 text-center text-2xl font-mono border-slate-300"
                      />
                    </div>
                    <span className="text-3xl font-bold text-slate-400 mt-6">:</span>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-600">Seconds</Label>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={seconds}
                        onChange={(e) => handleInputChange(e.target.value, setSeconds, 59)}
                        className="w-20 text-center text-2xl font-mono border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-2">
                  <Label className="text-sm text-slate-600">Quick Presets</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => { setHours(0); setMinutes(1); setSeconds(0); }}
                      className="border-slate-300 text-slate-700"
                    >
                      1 min
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { setHours(0); setMinutes(5); setSeconds(0); }}
                      className="border-slate-300 text-slate-700"
                    >
                      5 min
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { setHours(0); setMinutes(10); setSeconds(0); }}
                      className="border-slate-300 text-slate-700"
                    >
                      10 min
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { setHours(0); setMinutes(15); setSeconds(0); }}
                      className="border-slate-300 text-slate-700"
                    >
                      15 min
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Running/Paused Mode
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
                      stroke="#475569"
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
                    <div className="text-6xl font-bold text-slate-800 font-mono">
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                </div>

                {timeRemaining === 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-slate-700">Time's Up!</p>
                  </div>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {!isRunning ? (
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="w-32 gap-2 bg-slate-700 hover:bg-slate-800"
                  disabled={isSetup && hours === 0 && minutes === 0 && seconds === 0}
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
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};