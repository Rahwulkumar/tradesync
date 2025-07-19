// 📊 AnalyticsDashboard.jsx - Professional Performance Analytics
// Location: components/AnalyticsDashboard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar,
  Target,
  DollarSign,
  Percent,
  Activity,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import GlassCard from './ui/GlassCard';
import NeonButton from './ui/NeonButton';
import TradingInput from './ui/TradingInput';
import { theme } from '../theme/theme';

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with empty data - no mock data
  const [analyticsData, setAnalyticsData] = useState({
    summary: {
      totalTrades: 0,
      winRate: 0,
      totalPnL: 0,
      averageRMultiple: 0,
      bestTrade: 0,
      worstTrade: 0,
      totalVolume: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      profitFactor: 0
    },
    
    dailyPnL: [],

    winLossDistribution: [
      { name: 'Wins', value: 0, count: 0, color: '#22c55e' },
      { name: 'Losses', value: 0, count: 0, color: '#ef4444' }
    ],

    strategyPerformance: [],

    timeOfDayPerformance: [],

    instrumentPerformance: [],

    rMultipleDistribution: []
  });

  // Calculate additional metrics
  const advancedMetrics = useMemo(() => {
    const { dailyPnL, summary } = analyticsData;
    
    if (!dailyPnL || dailyPnL.length === 0) {
      return {
        maxWinStreak: 0,
        maxLossStreak: 0,
        avgDailyPnL: 0,
        volatility: 0
      };
    }
    
    // Calculate consecutive wins/losses
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;

    dailyPnL.forEach(day => {
      if (day.pnl > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
      } else if (day.pnl < 0) {
        currentLossStreak++;
        currentWinStreak = 0;
        maxLossStreak = Math.max(maxLossStreak, currentLossStreak);
      }
    });

    // Calculate average daily P&L
    const avgDailyPnL = dailyPnL.reduce((sum, day) => sum + day.pnl, 0) / dailyPnL.length;

    // Calculate volatility (standard deviation of daily returns)
    const variance = dailyPnL.reduce((sum, day) => {
      return sum + Math.pow(day.pnl - avgDailyPnL, 2);
    }, 0) / dailyPnL.length;
    const volatility = Math.sqrt(variance);

    return {
      maxWinStreak,
      maxLossStreak,
      avgDailyPnL: parseFloat(avgDailyPnL.toFixed(2)),
      volatility: parseFloat(volatility.toFixed(2))
    };
  }, [analyticsData]);

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-white/20 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-white mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-white/80" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('PnL') || entry.name.includes('pnl') ? '$' : ''}{entry.value}
              {entry.name.includes('Rate') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 pb-6 border-b border-white/5">
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
              Performance Analytics
            </h1>
            <p className="text-white/60">
              Comprehensive trading performance analysis and insights
            </p>
          </div>
          
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Timeframe Filter */}
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-white/40 focus:border-white/40 min-w-[160px]"
            >
              <option value="7d" className="bg-black text-white">Last 7 Days</option>
              <option value="30d" className="bg-black text-white">Last 30 Days</option>
              <option value="90d" className="bg-black text-white">Last 90 Days</option>
              <option value="1y" className="bg-black text-white">Last Year</option>
            </select>

            {/* Export Button */}
            <NeonButton 
              variant="glass" 
              size="md"
              className="text-white/70 hover:text-white border-white/20 hover:border-white/40 px-6 py-3 min-w-[120px]"
            >
              <Download size={16} className="mr-3" />
              Export
            </NeonButton>

            {/* Refresh Button */}
            <NeonButton
              variant="glass"
              size="md"
              loading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
              }}
              className="text-white/70 hover:text-white border-white/20 hover:border-white/40 px-4 py-3 min-w-[56px] flex items-center justify-center"
            >
              <RefreshCw size={16} />
            </NeonButton>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 pb-6 border-b border-white/5">
          <GlassCard variant="medium" hoverable={true} className="h-full">
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/70 text-sm font-medium">Total P&L</span>
                <DollarSign size={18} className="text-white/50" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className={`text-2xl lg:text-3xl font-bold ${
                  analyticsData.summary.totalPnL > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  ${analyticsData.summary.totalPnL.toLocaleString()}
                </div>
                <div className="text-sm text-white/60 mt-1">
                  {analyticsData.summary.totalTrades} trades
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="medium" hoverable={true} className="h-full">
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/70 text-sm font-medium">Win Rate</span>
                <Target size={18} className="text-white/50" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  {analyticsData.summary.winRate}%
                </div>
                <div className="text-sm text-white/60 mt-1">
                  Success percentage
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="medium" hoverable={true} className="h-full">
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/70 text-sm font-medium">Avg R-Multiple</span>
                <Activity size={18} className="text-white/50" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className={`text-2xl lg:text-3xl font-bold ${
                  analyticsData.summary.averageRMultiple > 1 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {analyticsData.summary.averageRMultiple}R
                </div>
                <div className="text-sm text-white/60 mt-1">
                  Risk-reward efficiency
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="medium" hoverable={true} className="h-full">
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/70 text-sm font-medium">Profit Factor</span>
                <TrendingUp size={18} className="text-white/50" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className={`text-2xl lg:text-3xl font-bold ${
                  analyticsData.summary.profitFactor > 1 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {analyticsData.summary.profitFactor}
                </div>
                <div className="text-sm text-white/60 mt-1">
                  Gross profit vs loss
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="medium" hoverable={true} className="h-full">
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/70 text-sm font-medium">Max Drawdown</span>
                <TrendingDown size={18} className="text-white/50" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className={`text-2xl lg:text-3xl font-bold ${
                  analyticsData.summary.maxDrawdown < 5 ? 'text-emerald-400' : 
                  analyticsData.summary.maxDrawdown < 10 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {analyticsData.summary.maxDrawdown}%
                </div>
                <div className="text-sm text-white/60 mt-1">
                  Peak-to-trough loss
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 pb-6 border-b border-white/5">
          
          {/* P&L Curve */}
          <GlassCard variant="medium" hoverable={false} className="h-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white">P&L Curve</h3>
                  <p className="text-white/60 text-sm">Daily performance and cumulative growth</p>
                </div>
                <BarChart3 size={20} className="text-white/50" />
              </div>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.dailyPnL}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="cumulative" 
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.1}
                      strokeWidth={2}
                      name="Cumulative P&L"
                    />
                    <Bar dataKey="pnl" fill="#3b82f6" opacity={0.7} name="Daily P&L" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>

          {/* Win/Loss Distribution */}
          <GlassCard variant="medium" hoverable={false} className="h-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white">Win/Loss Distribution</h3>
                  <p className="text-white/60 text-sm">Trade outcome breakdown</p>
                </div>
                <PieChart size={20} className="text-white/50" />
              </div>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.winLossDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                    >
                      {analyticsData.winLossDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>

          {/* Time of Day Performance */}
          <GlassCard variant="medium" hoverable={false} className="h-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white">Time of Day Performance</h3>
                  <p className="text-white/60 text-sm">Hourly trading efficiency</p>
                </div>
                <Calendar size={20} className="text-white/50" />
              </div>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.timeOfDayPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="hour" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="pnl" fill="#8b5cf6" name="P&L" />
                    <Line 
                      type="monotone" 
                      dataKey="winRate" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Win Rate %"
                      yAxisId="right"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>

          {/* R-Multiple Distribution */}
          <GlassCard variant="medium" hoverable={false} className="h-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white">R-Multiple Distribution</h3>
                  <p className="text-white/60 text-sm">Risk-reward outcome frequency</p>
                </div>
                <Target size={20} className="text-white/50" />
              </div>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.rMultipleDistribution} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis type="category" dataKey="range" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#06b6d4" name="Trade Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Detailed Performance Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 pb-6 border-b border-white/5">
          
          {/* Strategy Performance */}
          <GlassCard variant="medium" hoverable={false} className="h-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white">Strategy Performance</h3>
                  <p className="text-white/60 text-sm">Performance breakdown by trading strategy</p>
                </div>
                <Target size={20} className="text-white/50" />
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-2 text-white/70 font-medium border-r border-white/5">Strategy</th>
                      <th className="text-right py-3 px-2 text-white/70 font-medium border-r border-white/5">Trades</th>
                      <th className="text-right py-3 px-2 text-white/70 font-medium border-r border-white/5">P&L</th>
                      <th className="text-right py-3 px-2 text-white/70 font-medium border-r border-white/5">Win Rate</th>
                      <th className="text-right py-3 px-2 text-white/70 font-medium">Avg R</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.strategyPerformance.map((strategy, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-2 font-medium text-white border-r border-white/5">
                          {strategy.strategy}
                        </td>
                        <td className="py-3 px-2 text-right text-white/70 border-r border-white/5">
                          {strategy.trades}
                        </td>
                        <td className={`py-3 px-2 text-right font-medium border-r border-white/5 ${
                          strategy.pnl > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          ${strategy.pnl.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-right text-white border-r border-white/5">
                          {strategy.winRate}%
                        </td>
                        <td className={`py-3 px-2 text-right font-medium ${
                          strategy.avgR > 1 ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {strategy.avgR}R
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </GlassCard>

          {/* Instrument Performance */}
          <GlassCard variant="medium" hoverable={false} className="h-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white">Instrument Performance</h3>
                  <p className="text-white/60 text-sm">Performance breakdown by currency pairs</p>
                </div>
                <Activity size={20} className="text-white/50" />
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-2 text-white/70 font-medium border-r border-white/5">Pair</th>
                      <th className="text-right py-3 px-2 text-white/70 font-medium border-r border-white/5">Trades</th>
                      <th className="text-right py-3 px-2 text-white/70 font-medium border-r border-white/5">P&L</th>
                      <th className="text-right py-3 px-2 text-white/70 font-medium border-r border-white/5">Win Rate</th>
                      <th className="text-right py-3 px-2 text-white/70 font-medium">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.instrumentPerformance.map((instrument, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-2 font-medium text-white border-r border-white/5">
                          {instrument.pair}
                        </td>
                        <td className="py-3 px-2 text-right text-white/70 border-r border-white/5">
                          {instrument.trades}
                        </td>
                        <td className={`py-3 px-2 text-right font-medium border-r border-white/5 ${
                          instrument.pnl > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          ${instrument.pnl.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-right text-white border-r border-white/5">
                          {instrument.winRate}%
                        </td>
                        <td className="py-3 px-2 text-right text-white/70">
                          {instrument.volume}M
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Advanced Metrics Summary */}
        <div className="mt-8">
          <GlassCard variant="medium" hoverable={false}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white">Advanced Performance Metrics</h3>
                  <p className="text-white/60 text-sm">Deep statistical analysis</p>
                </div>
                <BarChart3 size={20} className="text-white/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10 h-[120px] flex flex-col justify-between">
                  <div className="text-2xl font-bold text-emerald-400">
                    {advancedMetrics.maxWinStreak}
                  </div>
                  <div className="text-sm text-white/70 mt-1">Max Win Streak</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10 h-[120px] flex flex-col justify-between">
                  <div className="text-2xl font-bold text-red-400">
                    {advancedMetrics.maxLossStreak}
                  </div>
                  <div className="text-sm text-white/70 mt-1">Max Loss Streak</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10 h-[120px] flex flex-col justify-between">
                  <div className={`text-2xl font-bold ${
                    advancedMetrics.avgDailyPnL > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    ${advancedMetrics.avgDailyPnL}
                  </div>
                  <div className="text-sm text-white/70 mt-1">Avg Daily P&L</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10 h-[120px] flex flex-col justify-between">
                  <div className={`text-2xl font-bold ${
                    analyticsData.summary.sharpeRatio > 1 ? 'text-emerald-400' : 
                    analyticsData.summary.sharpeRatio > 0.5 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {analyticsData.summary.sharpeRatio}
                  </div>
                  <div className="text-sm text-white/70 mt-1">Sharpe Ratio</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
        
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
