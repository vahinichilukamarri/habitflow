import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, CheckCircle, Circle, TrendingUp, Award, BarChart3, List, FileText, Tag, Sparkles, Download, Edit2, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'learning', name: 'Learning', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700' },
  { id: 'fitness', name: 'Fitness', color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-700' },
  { id: 'productivity', name: 'Productivity', color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-700' },
  { id: 'health', name: 'Health', color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-700' },
  { id: 'creative', name: 'Creative', color: 'bg-yellow-500', lightColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
  { id: 'social', name: 'Social', color: 'bg-pink-500', lightColor: 'bg-pink-50', textColor: 'text-pink-700' },
  { id: 'other', name: 'Other', color: 'bg-gray-500', lightColor: 'bg-gray-50', textColor: 'text-gray-700' },
];

const HABIT_TEMPLATES = [
  {
    track: 'Student Success',
    habits: [
      { name: 'Study for 1 hour', category: 'learning' },
      { name: 'Review notes from class', category: 'learning' },
      { name: 'Complete assignments', category: 'productivity' },
      { name: 'Read for 30 minutes', category: 'learning' },
    ]
  },
  {
    track: 'Career Growth',
    habits: [
      { name: 'Learn new skill for 30min', category: 'learning' },
      { name: 'Work on side project', category: 'productivity' },
      { name: 'Network or reach out to 1 person', category: 'social' },
      { name: 'Read industry article', category: 'learning' },
    ]
  },
  {
    track: 'Health & Wellness',
    habits: [
      { name: '30 min exercise', category: 'fitness' },
      { name: 'Drink 8 glasses of water', category: 'health' },
      { name: '7-8 hours of sleep', category: 'health' },
      { name: 'Eat 3 healthy meals', category: 'health' },
      { name: '10 min meditation', category: 'health' },
    ]
  },
  {
    track: 'Personal Development',
    habits: [
      { name: 'Morning routine', category: 'productivity' },
      { name: 'Journal for 10 minutes', category: 'creative' },
      { name: 'Learn something new', category: 'learning' },
      { name: 'Practice gratitude', category: 'health' },
      { name: 'No phone 1hr before bed', category: 'health' },
    ]
  },
  {
    track: 'Productivity Boost',
    habits: [
      { name: 'Plan tomorrow tonight', category: 'productivity' },
      { name: '2 hours of deep work', category: 'productivity' },
      { name: 'Clear inbox to zero', category: 'productivity' },
      { name: 'No social media until noon', category: 'productivity' },
    ]
  },
  {
    track: 'Creative Life',
    habits: [
      { name: 'Create for 30 minutes', category: 'creative' },
      { name: 'Try something new', category: 'creative' },
      { name: 'Consume inspiring content', category: 'creative' },
      { name: 'Share your work', category: 'social' },
    ]
  },
  {
    track: 'Social Connection',
    habits: [
      { name: 'Message a friend', category: 'social' },
      { name: 'Quality time with family', category: 'social' },
      { name: 'Make someone smile', category: 'social' },
      { name: 'Call instead of text', category: 'social' },
    ]
  },
  {
    track: 'Balanced Life',
    habits: [
      { name: 'Morning meditation', category: 'health' },
      { name: 'Learn something new', category: 'learning' },
      { name: 'Exercise', category: 'fitness' },
      { name: 'Creative time', category: 'creative' },
      { name: 'Connect with someone', category: 'social' },
    ]
  },
];

const MILESTONES = [
  { days: 3, message: '3-day streak! 🔥', description: "You're building momentum!" },
  { days: 7, message: '1 week strong! 🌟', description: "That's a solid week!" },
  { days: 14, message: '2 weeks! 💪', description: "You're crushing it!" },
  { days: 21, message: '21 days! 🎯', description: "They say it takes 21 days to form a habit!" },
  { days: 30, message: '30-day milestone! 🏆', description: "One month of consistency!" },
  { days: 50, message: '50 days! 🚀', description: "You're unstoppable!" },
  { days: 100, message: '100-day legend! 👑', description: "This is incredible dedication!" },
];

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('other');
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('daily');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showTemplates, setShowTemplates] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({ habitId: null, date: null, text: '' });
  const [celebration, setCelebration] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showLanding, setShowLanding] = useState(true);

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
  try {
    const stored = localStorage.getItem('habits-data');
    if (stored) {
      setHabits(JSON.parse(stored));
    }
  } catch (error) {
    console.log('No existing habits found');
  } finally {
    setIsLoading(false);
  }
};

  const saveHabits = (updatedHabits) => {
  try {
    localStorage.setItem('habits-data', JSON.stringify(updatedHabits));
  } catch (error) {
    console.error('Failed to save habits:', error);
  }
};

  const addHabit = (name = newHabitName, category = newHabitCategory) => {
    if (name.trim()) {
      const newHabit = {
        id: Date.now().toString(),
        name: name.trim(),
        category: category,
        completedDates: [],
        notes: {},
        createdAt: new Date().toISOString()
      };
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      saveHabits(updatedHabits);
      setNewHabitName('');
      setNewHabitCategory('other');
    }
  };

  const addHabitsFromTemplate = (template) => {
    const newHabits = template.habits.map(h => ({
      id: Date.now().toString() + Math.random().toString(),
      name: h.name,
      category: h.category,
      completedDates: [],
      notes: {},
      createdAt: new Date().toISOString()
    }));
    const updatedHabits = [...habits, ...newHabits];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    setShowTemplates(false);
  };

  const deleteHabit = (habitId) => {
    const updatedHabits = habits.filter(h => h.id !== habitId);
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const checkForMilestone = (streak) => {
    const milestone = MILESTONES.find(m => m.days === streak);
    if (milestone) {
      setCelebration(milestone);
      setTimeout(() => setCelebration(null), 5000);
    }
  };

  const toggleHabitToday = (habitId) => {
    const today = getTodayString();
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const completedDates = habit.completedDates || [];
        const isCompleted = completedDates.includes(today);
        
        if (!isCompleted) {
          const newCompletedDates = [...completedDates, today];
          const newStreak = calculateStreak(newCompletedDates);
          checkForMilestone(newStreak);
        }

        return {
          ...habit,
          completedDates: isCompleted
            ? completedDates.filter(date => date !== today)
            : [...completedDates, today]
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const saveNote = () => {
    if (currentNote.habitId && currentNote.date) {
      const updatedHabits = habits.map(habit => {
        if (habit.id === currentNote.habitId) {
          return {
            ...habit,
            notes: {
              ...habit.notes,
              [currentNote.date]: currentNote.text
            }
          };
        }
        return habit;
      });
      setHabits(updatedHabits);
      saveHabits(updatedHabits);
      setShowNoteModal(false);
      setCurrentNote({ habitId: null, date: null, text: '' });
    }
  };

  const openNoteModal = (habitId, date) => {
    const habit = habits.find(h => h.id === habitId);
    const existingNote = habit?.notes?.[date] || '';
    setCurrentNote({ habitId, date, text: existingNote });
    setShowNoteModal(true);
  };

  const calculateStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;
    
    const sortedDates = [...completedDates].sort().reverse();
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      const expectedDateString = expectedDate.toISOString().split('T')[0];
      
      if (sortedDates[i] === expectedDateString) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const isCompletedToday = (completedDates) => {
    return completedDates && completedDates.includes(getTodayString());
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateCompleted = (habit, dateString) => {
    return habit.completedDates && habit.completedDates.includes(dateString);
  };

  const getMonthStats = (habit) => {
    if (!habit.completedDates || habit.completedDates.length === 0) {
      return { completionRate: 0, daysCompleted: 0, totalDays: 0 };
    }

    const { year, month } = getDaysInMonth(selectedMonth);
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const today = new Date();
    
    const endDate = monthEnd > today ? today : monthEnd;
    const totalDays = Math.max(1, Math.floor((endDate - monthStart) / (1000 * 60 * 60 * 24)) + 1);
    
    const daysCompleted = habit.completedDates.filter(dateString => {
      const date = new Date(dateString + 'T00:00:00');
      return date >= monthStart && date <= endDate;
    }).length;

    const completionRate = Math.round((daysCompleted / totalDays) * 100);
    
    return { completionRate, daysCompleted, totalDays };
  };

  const getBestStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;
    
    const sortedDates = [...completedDates].sort();
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const dayDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  };

  const getCategoryColor = (categoryId) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
  };

  const getFilteredHabits = () => {
    if (filterCategory === 'all') return habits;
    return habits.filter(h => h.category === filterCategory);
  };

  const generateReport = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    let reportText = `📊 Habit Tracker Weekly Report\n`;
    reportText += `${weekAgo.toLocaleDateString()} - ${today.toLocaleDateString()}\n\n`;
    
    habits.forEach(habit => {
      const weekCompletions = habit.completedDates.filter(date => {
        const d = new Date(date);
        return d >= weekAgo && d <= today;
      }).length;
      const percentage = Math.round((weekCompletions / 7) * 100);
      const category = getCategoryColor(habit.category);
      
      reportText += `${habit.name} (${category.name})\n`;
      reportText += `  ✓ ${weekCompletions}/7 days (${percentage}%)\n`;
      reportText += `  🔥 Current streak: ${calculateStreak(habit.completedDates)} days\n\n`;
    });
    
    const totalPossible = habits.length * 7;
    const totalCompleted = habits.reduce((sum, h) => {
      return sum + h.completedDates.filter(date => {
        const d = new Date(date);
        return d >= weekAgo && d <= today;
      }).length;
    }, 0);
    const overallRate = Math.round((totalCompleted / totalPossible) * 100);
    
    reportText += `Overall: ${totalCompleted}/${totalPossible} (${overallRate}%)\n`;
    reportText += `\n💪 Keep up the great work!`;
    
    return reportText;
  };

  const downloadReport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading your habits...</div>
      </div>
    );
  }

  // Landing Page
  if (showLanding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-pink-500 rounded-full opacity-20 blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-full border border-white border-opacity-20">
                  <Sparkles className="w-20 h-20 text-white" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200">
                HabitFlow
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-4 font-light">
              Transform Your Life, One Habit at a Time
            </p>
            
            <p className="text-lg text-purple-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Build lasting habits with beautiful tracking, insightful analytics, and milestone celebrations. 
              Your journey to a better you starts here.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
                <Calendar className="w-10 h-10 text-purple-300 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">Visual Tracking</h3>
                <p className="text-purple-200 text-sm">See your progress with beautiful calendars and streaks</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
                <BarChart3 className="w-10 h-10 text-pink-300 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">Deep Analytics</h3>
                <p className="text-purple-200 text-sm">Understand your patterns with detailed stats</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
                <Award className="w-10 h-10 text-blue-300 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">Celebrations</h3>
                <p className="text-purple-200 text-sm">Hit milestones and celebrate your wins</p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowLanding(false)}
              className="group relative inline-flex items-center gap-3 px-12 py-5 text-xl font-semibold text-purple-900 bg-white rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
            >
              <span>Start Your Journey</span>
              <TrendingUp className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-purple-300 text-sm mt-6">
              No signup required • Free forever • Your data stays private
            </p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute bottom-10 left-10 text-purple-300 opacity-50 hidden md:block">
          <CheckCircle className="w-16 h-16 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute top-20 right-20 text-pink-300 opacity-50 hidden md:block">
          <TrendingUp className="w-12 h-12 animate-bounce" style={{ animationDuration: '2.5s' }} />
        </div>
      </div>
    );
  }

  const renderCalendarView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(selectedMonth);
    const monthName = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const changeMonth = (delta) => {
      const newDate = new Date(selectedMonth);
      newDate.setMonth(newDate.getMonth() + delta);
      setSelectedMonth(newDate);
    };

    const filteredHabits = getFilteredHabits();

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
          <button
            onClick={() => changeMonth(-1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ← Previous
          </button>
          <h2 className="text-xl font-semibold text-gray-800">{monthName}</h2>
          <button
            onClick={() => changeMonth(1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>

        {filteredHabits.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No habits to display.</p>
          </div>
        ) : (
          filteredHabits.map(habit => {
            const stats = getMonthStats(habit);
            const category = getCategoryColor(habit.category);
            
            return (
              <div key={habit.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${category.color} text-white`}>
                      {category.name}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    {stats.daysCompleted} / {stats.totalDays} days ({stats.completionRate}%)
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {days.map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square"></div>
                  ))}
                  
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isCompleted = isDateCompleted(habit, dateString);
                    const isToday = dateString === getTodayString();
                    const isFuture = new Date(dateString) > new Date();
                    const hasNote = habit.notes && habit.notes[dateString];
                    
                    return (
                      <div
                        key={day}
                        onClick={() => !isFuture && openNoteModal(habit.id, dateString)}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer relative
                          ${isFuture ? 'bg-gray-50 text-gray-300' : ''}
                          ${isCompleted && !isFuture ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                          ${!isCompleted && !isFuture ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : ''}
                          ${isToday ? 'ring-2 ring-purple-500' : ''}
                        `}
                      >
                        {day}
                        {hasNote && (
                          <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderStatsView = () => {
    const filteredHabits = getFilteredHabits();

    if (filteredHabits.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No habits to analyze.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Overall Statistics</h2>
            <button
              onClick={downloadReport}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{filteredHabits.length}</p>
              <p className="text-sm text-gray-600">Total Habits</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {filteredHabits.filter(h => isCompletedToday(h.completedDates)).length}
              </p>
              <p className="text-sm text-gray-600">Completed Today</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {Math.round(filteredHabits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0) / Math.max(filteredHabits.length, 1))}
              </p>
              <p className="text-sm text-gray-600">Avg Completions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Habit Breakdown</h2>
          <div className="space-y-4">
            {filteredHabits.map(habit => {
              const currentStreak = calculateStreak(habit.completedDates);
              const bestStreak = getBestStreak(habit.completedDates);
              const totalCompletions = habit.completedDates?.length || 0;
              const stats = getMonthStats(habit);
              const daysActive = Math.max(1, Math.floor((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)) + 1);
              const overallRate = Math.round((totalCompletions / daysActive) * 100);
              const category = getCategoryColor(habit.category);

              return (
                <div key={habit.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${category.color} text-white`}>
                      {category.name}
                    </span>
                    <h3 className="font-semibold text-gray-800">{habit.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{currentStreak}</p>
                      <p className="text-xs text-gray-600">Current Streak</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{bestStreak}</p>
                      <p className="text-xs text-gray-600">Best Streak</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.completionRate}%</p>
                      <p className="text-xs text-gray-600">This Month</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{overallRate}%</p>
                      <p className="text-xs text-gray-600">All Time</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    Total completions: {totalCompletions} | Active for: {daysActive} days
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              HabitFlow
            </h1>
          </div>
          <p className="text-gray-600">Transform your life, one day at a time</p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl shadow-lg p-2 border border-gray-100">
          <button
            onClick={() => setCurrentView('daily')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-medium ${
              currentView === 'daily' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List className="w-4 h-4" />
            Daily
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-medium ${
              currentView === 'calendar' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
          <button
            onClick={() => setCurrentView('stats')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-medium ${
              currentView === 'stats' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Stats
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Filter:</span>
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all font-medium ${
                filterCategory === 'all' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all font-medium ${
                  filterCategory === cat.id ? `${cat.color} text-white shadow-md` : `${cat.lightColor} ${cat.textColor} hover:opacity-80`
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Add New Habit */}
        {currentView === 'daily' && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                  placeholder="Add a new habit..."
                  className="flex-1 px-4 py-3 border-2 border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 backdrop-blur-sm"
                />
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value)}
                  className="px-4 py-3 border-2 border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-20 text-white backdrop-blur-sm"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id} className="text-gray-800">{cat.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => addHabit()}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2 font-semibold shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </div>
              <button
                onClick={() => setShowTemplates(true)}
                className="text-sm text-white hover:text-opacity-90 flex items-center gap-1 justify-center py-2"
              >
                <Sparkles className="w-4 h-4" />
                Or choose from our curated templates
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {currentView === 'daily' && renderDailyView()}
        {currentView === 'calendar' && renderCalendarView()}
        {currentView === 'stats' && renderStatsView()}

        {/* Templates Modal */}
        {showTemplates && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowTemplates(false)}
          >
            <div 
              className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl"
              style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fixed */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-800">Choose a Template</h2>
                <button 
                  onClick={() => setShowTemplates(false)} 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6" style={{ flex: '1 1 auto' }}>
                <div className="space-y-4">
                  {HABIT_TEMPLATES.map((template, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 transition-colors">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{template.track}</h3>
                      <ul className="space-y-1 mb-3">
                        {template.habits.map((habit, hidx) => {
                          const cat = getCategoryColor(habit.category);
                          return (
                            <li key={hidx} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs ${cat.color} text-white`}>
                                {cat.name}
                              </span>
                              {habit.name}
                            </li>
                          );
                        })}
                      </ul>
                      <button
                        onClick={() => addHabitsFromTemplate(template)}
                        className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Add These Habits
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Note Modal */}
        {showNoteModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowNoteModal(false)}
          >
            <div 
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Add Note</h2>
                <button 
                  onClick={() => setShowNoteModal(false)} 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <textarea
                  value={currentNote.text}
                  onChange={(e) => setCurrentNote({ ...currentNote, text: e.target.value })}
                  placeholder="How did it go? Any thoughts?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={saveNote}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => setShowNoteModal(false)}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Celebration */}
        {celebration && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-bounce">
            <div className="text-center">
              <div className="text-3xl mb-2">{celebration.message}</div>
              <div className="text-sm">{celebration.description}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function renderDailyView() {
    const filteredHabits = getFilteredHabits();

    return (
      <>
        {filteredHabits.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No habits yet. Add your first habit above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHabits.map((habit) => {
              const streak = calculateStreak(habit.completedDates);
              const completed = isCompletedToday(habit.completedDates);
              const totalCompleted = habit.completedDates?.length || 0;
              const category = getCategoryColor(habit.category);
              const todayNote = habit.notes?.[getTodayString()];

              return (
                <div
                  key={habit.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => toggleHabitToday(habit.id)}
                        className="focus:outline-none"
                      >
                        {completed ? (
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        ) : (
                          <Circle className="w-8 h-8 text-gray-300 hover:text-gray-400" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${category.color} text-white`}>
                            {category.name}
                          </span>
                          <h3 className={`text-lg font-semibold ${completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                            {habit.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{streak} day streak</span>
                          </div>
                          <div>
                            <span>{totalCompleted} total</span>
                          </div>
                          <button
                            onClick={() => openNoteModal(habit.id, getTodayString())}
                            className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
                          >
                            <Edit2 className="w-4 h-4" />
                            {todayNote ? 'Edit note' : 'Add note'}
                          </button>
                        </div>
                        {todayNote && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-gray-700 italic">
                            "{todayNote}"
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredHabits.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Progress</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">
                  {filteredHabits.filter(h => isCompletedToday(h.completedDates)).length} / {filteredHabits.length}
                </p>
                <p className="text-gray-600">habits completed</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((filteredHabits.filter(h => isCompletedToday(h.completedDates)).length / filteredHabits.length) * 100)}%
                </p>
                <p className="text-gray-600">completion rate</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-800">
            <strong>Tip:</strong> Click on any calendar day to add notes about your progress! Track what worked and what didn't.
          </p>
        </div>
      </>
    );
  }
}