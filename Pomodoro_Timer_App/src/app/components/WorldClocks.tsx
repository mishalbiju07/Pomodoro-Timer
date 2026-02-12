import React, { useState, useEffect } from 'react';
import { Clock, Plus, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TimeZone {
  id: string;
  city: string;
  timezone: string;
}

const POPULAR_TIMEZONES = [
  { city: 'New York', timezone: 'America/New_York' },
  { city: 'London', timezone: 'Europe/London' },
  { city: 'Paris', timezone: 'Europe/Paris' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo' },
  { city: 'Sydney', timezone: 'Australia/Sydney' },
  { city: 'Dubai', timezone: 'Asia/Dubai' },
  { city: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { city: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { city: 'Singapore', timezone: 'Asia/Singapore' },
  { city: 'Mumbai', timezone: 'Asia/Kolkata' },
  { city: 'São Paulo', timezone: 'America/Sao_Paulo' },
  { city: 'Moscow', timezone: 'Europe/Moscow' },
  { city: 'Shanghai', timezone: 'Asia/Shanghai' },
  { city: 'Berlin', timezone: 'Europe/Berlin' },
  { city: 'Toronto', timezone: 'America/Toronto' },
];

export const WorldClocks: React.FC = () => {
  const [timezones, setTimezones] = useState<TimeZone[]>([
    { id: '1', city: 'New York', timezone: 'America/New_York' },
    { id: '2', city: 'London', timezone: 'Europe/London' },
    { id: '3', city: 'Tokyo', timezone: 'Asia/Tokyo' },
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeForZone = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(currentTime);
  };

  const getDateForZone = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(currentTime);
  };

  const addTimezone = () => {
    if (!selectedTimezone) return;
    
    const selected = POPULAR_TIMEZONES.find(tz => tz.timezone === selectedTimezone);
    if (selected && !timezones.find(tz => tz.timezone === selectedTimezone)) {
      setTimezones([...timezones, {
        id: Date.now().toString(),
        city: selected.city,
        timezone: selected.timezone,
      }]);
    }
    setShowAddDialog(false);
    setSelectedTimezone('');
  };

  const removeTimezone = (id: string) => {
    setTimezones(timezones.filter(tz => tz.id !== id));
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">World Clocks</h1>
            <p className="text-slate-600 mt-1">Track time across different time zones</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2 bg-slate-700 hover:bg-slate-800">
            <Plus className="w-4 h-4" />
            Add Clock
          </Button>
        </div>

        {/* Clocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timezones.map((tz) => (
            <Card key={tz.id} className="p-6 relative hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm border-slate-300">
              {timezones.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 hover:bg-slate-100"
                  onClick={() => removeTimezone(tz.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-700" />
                  <h3 className="text-xl font-semibold text-slate-800">{tz.city}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-slate-800 font-mono">
                    {getTimeForZone(tz.timezone)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {getDateForZone(tz.timezone)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Timezone Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md p-6 space-y-6 bg-white border-slate-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Add Time Zone</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddDialog(false)}
                  className="hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_TIMEZONES.map((tz) => (
                      <SelectItem key={tz.timezone} value={tz.timezone}>
                        {tz.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-400 text-slate-700"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-slate-700 hover:bg-slate-800"
                  onClick={addTimezone}
                  disabled={!selectedTimezone}
                >
                  Add Clock
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};