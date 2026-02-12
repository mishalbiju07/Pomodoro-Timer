import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Lap {
  id: number;
  time: number;
  lapTime: number;
}

export const Stopwatch: React.FC = () => {
  const [time, setTime] = useState<number>(0); // in milliseconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - previousTimeRef.current;
      
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      previousTimeRef.current = time;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    previousTimeRef.current = 0;
  };

  const handleLap = () => {
    const lapTime = laps.length > 0 ? time - laps[laps.length - 1].time : time;
    setLaps([...laps, {
      id: laps.length + 1,
      time: time,
      lapTime: lapTime,
    }]);
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const getFastestLap = (): number | null => {
    if (laps.length === 0) return null;
    return Math.min(...laps.map(lap => lap.lapTime));
  };

  const getSlowestLap = (): number | null => {
    if (laps.length === 0) return null;
    return Math.max(...laps.map(lap => lap.lapTime));
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">Stopwatch</h1>
          <p className="text-slate-600">Track your time with precision</p>
        </div>

        {/* Main Stopwatch Card */}
        <Card className="p-8 shadow-xl bg-white/90 backdrop-blur-sm border-slate-300">
          <div className="space-y-8">
            {/* Time Display */}
            <div className="text-center">
              <div className="text-7xl md:text-8xl font-bold text-slate-800 font-mono">
                {formatTime(time)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {!isRunning ? (
                <Button
                  size="lg"
                  onClick={time === 0 ? handleStart : handleStart}
                  className="w-32 gap-2 bg-slate-700 hover:bg-slate-800"
                >
                  <Play className="w-5 h-5" />
                  {time === 0 ? 'Start' : 'Resume'}
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
              
              {(isRunning || time > 0) && (
                <Button
                  size="lg"
                  onClick={handleLap}
                  variant="outline"
                  className="gap-2 border-slate-400 text-slate-700 hover:bg-slate-100"
                  disabled={!isRunning && time === 0}
                >
                  <Flag className="w-5 h-5" />
                  Lap
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Laps */}
        {laps.length > 0 && (
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-slate-300">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Laps</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[...laps].reverse().map((lap) => {
                const fastest = getFastestLap();
                const slowest = getSlowestLap();
                const isFastest = lap.lapTime === fastest && laps.length > 1;
                const isSlowest = lap.lapTime === slowest && laps.length > 1;
                
                return (
                  <div
                    key={lap.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isFastest ? 'bg-slate-200' : isSlowest ? 'bg-slate-300' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-slate-700 w-16">
                        Lap {lap.id}
                      </span>
                      <span className={`font-mono text-lg ${
                        isFastest ? 'text-slate-900 font-semibold' : 
                        isSlowest ? 'text-slate-800 font-semibold' : 
                        'text-slate-700'
                      }`}>
                        {formatTime(lap.lapTime)}
                      </span>
                    </div>
                    <span className="font-mono text-sm text-slate-600">
                      {formatTime(lap.time)}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};