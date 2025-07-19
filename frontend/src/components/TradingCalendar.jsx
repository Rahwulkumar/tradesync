import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Filter, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TradingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trades, setTrades] = useState([]);
  const [filters, setFilters] = useState({
    showProfit: true,
    showLoss: true,
    showBreakeven: true
  });

  useEffect(() => {
    // Load trades from localStorage
    const loadTrades = () => {
      try {
        const storedTrades = JSON.parse(localStorage.getItem('tradesync_trades') || '[]');
        setTrades(storedTrades);
      } catch (error) {
        console.error('Error loading trades:', error);
      }
    };

    loadTrades();
    window.addEventListener('storage', loadTrades);
    return () => window.removeEventListener('storage', loadTrades);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getTradeDataForDate = (date) => {
    if (!date) return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const dayTrades = trades.filter(trade => trade.date === dateStr);
    
    if (dayTrades.length === 0) return null;
    
    const totalPnL = dayTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0);
    const winCount = dayTrades.filter(trade => parseFloat(trade.pnl || 0) > 0).length;
    
    return {
      totalPnL,
      tradeCount: dayTrades.length,
      winCount,
      winRate: dayTrades.length > 0 ? (winCount / dayTrades.length) * 100 : 0
    };
  };

  const getDayClasses = (tradeData) => {
    if (!tradeData) return 'bg-white/5 border-white/10 hover:border-white/20';
    
    const baseClasses = 'border transition-all duration-300 hover:scale-105';
    
    if (tradeData.totalPnL > 0) {
      return `${baseClasses} bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400/50 hover:bg-emerald-500/20`;
    } else if (tradeData.totalPnL < 0) {
      return `${baseClasses} bg-red-500/10 border-red-500/30 hover:border-red-400/50 hover:bg-red-500/20`;
    } else {
      return `${baseClasses} bg-amber-500/10 border-amber-500/30 hover:border-amber-400/50 hover:bg-amber-500/20`;
    }
  };

  const shouldShowDay = (tradeData) => {
    if (!tradeData) return true;
    
    if (tradeData.totalPnL > 0) return filters.showProfit;
    if (tradeData.totalPnL < 0) return filters.showLoss;
    return filters.showBreakeven;
  };

  const toggleFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full p-6">
      {/* Header with Navigation and Filters */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h3 className="text-2xl font-bold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white/70 hover:text-white border border-white/10 hover:border-white/30"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white/70 hover:text-white border border-white/10 hover:border-white/30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <Filter size={16} />
            <span>Filter:</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.showProfit}
                onChange={() => toggleFilter('showProfit')}
                className="w-4 h-4 rounded bg-white/10 border-emerald-500/50 text-emerald-500 focus:ring-emerald-500/20 focus:ring-2"
              />
              <div className="flex items-center space-x-1">
                <TrendingUp size={14} className="text-emerald-400" />
                <span className="text-sm text-white/70 group-hover:text-emerald-400 transition-colors">Profit</span>
              </div>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.showLoss}
                onChange={() => toggleFilter('showLoss')}
                className="w-4 h-4 rounded bg-white/10 border-red-500/50 text-red-500 focus:ring-red-500/20 focus:ring-2"
              />
              <div className="flex items-center space-x-1">
                <TrendingDown size={14} className="text-red-400" />
                <span className="text-sm text-white/70 group-hover:text-red-400 transition-colors">Loss</span>
              </div>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.showBreakeven}
                onChange={() => toggleFilter('showBreakeven')}
                className="w-4 h-4 rounded bg-white/10 border-amber-500/50 text-amber-500 focus:ring-amber-500/20 focus:ring-2"
              />
              <div className="flex items-center space-x-1">
                <Minus size={14} className="text-amber-400" />
                <span className="text-sm text-white/70 group-hover:text-amber-400 transition-colors">Break Even</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3 mb-8">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-white/60 uppercase tracking-wider">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((date, index) => {
          const tradeData = getTradeDataForDate(date);
          const isToday = date && date.toDateString() === new Date().toDateString();
          const showDay = shouldShowDay(tradeData);
          
          if (!date) {
            return <div key={index} className="min-h-[90px]" />;
          }
          
          return (
            <div
              key={index}
              className={`
                min-h-[90px] p-4 rounded-2xl cursor-pointer backdrop-blur-sm
                ${getDayClasses(tradeData)}
                ${isToday ? 'ring-2 ring-blue-400/50 ring-offset-2 ring-offset-transparent' : ''}
                ${!showDay ? 'opacity-30 pointer-events-none' : ''}
              `}
            >
              <div className="flex flex-col h-full">
                <div className="text-sm font-semibold text-white mb-2">
                  {date.getDate()}
                </div>
                
                {tradeData && showDay && (
                  <div className="flex-1 flex flex-col justify-between">
                    <div className={`text-sm font-bold ${
                      tradeData.totalPnL > 0 ? 'text-emerald-300' : 
                      tradeData.totalPnL < 0 ? 'text-red-300' : 
                      'text-amber-300'
                    }`}>
                      ${tradeData.totalPnL > 0 ? '+' : ''}{Math.abs(tradeData.totalPnL).toFixed(0)}
                    </div>
                    
                    <div className="text-xs text-white/60 mt-1">
                      {tradeData.tradeCount} trade{tradeData.tradeCount !== 1 ? 's' : ''}
                    </div>
                    
                    {tradeData.tradeCount > 1 && (
                      <div className="text-xs text-white/50 mt-1">
                        {tradeData.winRate.toFixed(0)}% win
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Legend */}
      <div className="flex items-center justify-center space-x-8 text-sm">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-emerald-500/20 rounded-xl border border-emerald-500/30"></div>
          <span className="text-white/70 font-medium">Profitable Days</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-red-500/20 rounded-xl border border-red-500/30"></div>
          <span className="text-white/70 font-medium">Loss Days</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-amber-500/20 rounded-xl border border-amber-500/30"></div>
          <span className="text-white/70 font-medium">Break Even</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-white/5 rounded-xl border border-white/10"></div>
          <span className="text-white/70 font-medium">No Trades</span>
        </div>
      </div>
    </div>
  );
};

export default TradingCalendar;