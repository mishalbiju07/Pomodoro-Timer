import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';

interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const DailyPlanner: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('dailyPlannerTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    time: '',
    priority: 'medium',
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('dailyPlannerTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const addTask = () => {
    if (!newTask.title?.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || '',
      time: newTask.time || '',
      priority: newTask.priority || 'medium',
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', time: '', priority: 'medium' });
    setShowAddDialog(false);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by completion status first (incomplete first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then by time
    if (a.time && b.time) {
      return a.time.localeCompare(b.time);
    }
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500';
      case 'medium':
        return 'border-l-4 border-l-yellow-500';
      case 'low':
        return 'border-l-4 border-l-green-500';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Daily Planner</h1>
            <div className="flex items-center gap-2 mt-2 text-slate-600">
              <CalendarIcon className="w-4 h-4" />
              <p>{formatDate(currentDate)}</p>
            </div>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2 bg-slate-700 hover:bg-slate-800">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>

        {/* Progress Card */}
        {totalCount > 0 && (
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-slate-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Today's Progress</span>
                <span className="text-sm font-semibold text-slate-800">
                  {completedCount} / {totalCount} tasks
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-slate-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          {sortedTasks.length === 0 ? (
            <Card className="p-12 text-center bg-white/90 backdrop-blur-sm border-slate-300">
              <div className="flex flex-col items-center gap-4">
                <CalendarIcon className="w-16 h-16 text-slate-400" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-600">No tasks yet</h3>
                  <p className="text-slate-500 mt-1">Add your first task to get started!</p>
                </div>
              </div>
            </Card>
          ) : (
            sortedTasks.map((task) => (
              <Card
                key={task.id}
                className={`p-4 transition-all hover:shadow-md bg-white/90 backdrop-blur-sm border-slate-300 ${getPriorityColor(task.priority)} ${
                  task.completed ? 'opacity-60 bg-slate-50/90' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskComplete(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold ${
                            task.completed ? 'line-through text-slate-500' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`text-sm mt-1 ${
                            task.completed ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {task.description}
                          </p>
                        )}
                        {task.time && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{task.time}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Add Task Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md p-6 space-y-6 bg-white border-slate-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Add New Task</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddDialog(false)}
                  className="hover:bg-slate-100"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Task Title *</label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                    autoFocus
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Add task description (optional)"
                    rows={3}
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Time</label>
                  <Input
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Priority</label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((priority) => (
                      <Button
                        key={priority}
                        variant={newTask.priority === priority ? 'default' : 'outline'}
                        className={`flex-1 capitalize ${
                          newTask.priority === priority 
                            ? 'bg-slate-700 hover:bg-slate-800' 
                            : 'border-slate-300 text-slate-700'
                        }`}
                        onClick={() => setNewTask({ ...newTask, priority })}
                      >
                        {priority}
                      </Button>
                    ))}
                  </div>
                </div>
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
                  className="flex-1 gap-2 bg-slate-700 hover:bg-slate-800"
                  onClick={addTask}
                  disabled={!newTask.title?.trim()}
                >
                  <Check className="w-4 h-4" />
                  Add Task
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};