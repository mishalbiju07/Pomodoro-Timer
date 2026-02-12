import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PomodoroConfig } from './PomodoroTimer';

interface ConfigPanelProps {
  config: PomodoroConfig;
  onSave: (config: PomodoroConfig) => void;
  onClose: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onSave, onClose }) => {
  const [localConfig, setLocalConfig] = useState<PomodoroConfig>(config);

  const handleSave = () => {
    onSave(localConfig);
  };

  const handleChange = (field: keyof PomodoroConfig, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setLocalConfig((prev) => ({
        ...prev,
        [field]: numValue,
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white border-slate-300">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Timer Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Configuration Inputs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workDuration" className="text-slate-700">Work Duration (minutes)</Label>
            <Input
              id="workDuration"
              type="number"
              min="1"
              value={localConfig.workDuration}
              onChange={(e) => handleChange('workDuration', e.target.value)}
              className="border-slate-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortBreakDuration" className="text-slate-700">Short Break Duration (minutes)</Label>
            <Input
              id="shortBreakDuration"
              type="number"
              min="1"
              value={localConfig.shortBreakDuration}
              onChange={(e) => handleChange('shortBreakDuration', e.target.value)}
              className="border-slate-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longBreakDuration" className="text-slate-700">Long Break Duration (minutes)</Label>
            <Input
              id="longBreakDuration"
              type="number"
              min="1"
              value={localConfig.longBreakDuration}
              onChange={(e) => handleChange('longBreakDuration', e.target.value)}
              className="border-slate-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionsUntilLongBreak" className="text-slate-700">Work Sessions Before Long Break</Label>
            <Input
              id="sessionsUntilLongBreak"
              type="number"
              min="1"
              value={localConfig.sessionsUntilLongBreak}
              onChange={(e) => handleChange('sessionsUntilLongBreak', e.target.value)}
              className="border-slate-300"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1 border-slate-400 text-slate-700"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-slate-700 hover:bg-slate-800"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};