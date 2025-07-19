import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign, 
  Activity,
  Award,
  AlertTriangle,
  Calendar,
  Clock,
  BarChart3,
  Zap,
  Shield,
  User,
  RefreshCw,
  Eye,
  Plus,
  PieChart
} from 'lucide-react';
import GlassCard from './ui/GlassCard';
import NeonButton from './ui/NeonButton';
import TradingInput from './ui/TradingInput';
import TradingCalendar from './TradingCalendar';
import { theme } from '../theme/theme';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const Dashboard = () => {
  // Initialize with empty state - no mock data
  const [dashboardData, setDashboardData] = useState({
    accounts: [],
    todayStats: {
      totalPnL: 0,
      totalTrades: 0,
      winRate: 0,
      rMultiple: 0,
      bestTrade: 0,
      worstTrade: 0,
      activeStreak: 0
    },
    riskMetrics: {
      dailyDrawdown: 0,
      maxDailyDrawdown: 5.0,
      accountDrawdown: 0,
      maxAccountDrawdown: 10.0
    },
    recentTrades: []
  });

  // Use real data state
  const [realDashboardData, setRealDashboardData] = useState(dashboardData);
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Load real data from localStorage
  const loadRealData = useCallback(() => {
    try {
      const trades = JSON.parse(localStorage.getItem('tradesync_trades') || '[]');
      const accounts = JSON.parse(localStorage.getItem('tradesync_accounts') || '[]');
      
      if (trades.length === 0) {
        console.log('No trades found, showing empty dashboard');
        setRealDashboardData(dashboardData);
        return;
      }

      // Calculate real metrics
      const totalTrades = trades.length;
      const winningTrades = trades.filter(t => parseFloat(t.pnl || 0) > 0);
      const totalPnL = trades.reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0);
      const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
      
      const rMultiples = trades
        .filter(t => t.r_multiple || t.rMultiple)
        .map(t => parseFloat(t.r_multiple || t.rMultiple || 0));
      const averageR = rMultiples.length > 0 
        ? rMultiples.reduce((sum, r) => sum + r, 0) / rMultiples.length 
        : 0;

      const bestTrade = Math.max(...trades.map(t => parseFloat(t.pnl || 0)));
      const worstTrade = Math.min(...trades.map(t => parseFloat(t.pnl || 0)));

      // Get recent trades
      const recentTrades = trades.slice(0, 3).map(trade => ({
        id: trade.id,
        pair: trade.instrument,
        pnl: parseFloat(trade.pnl || 0),
        rMultiple: parseFloat(trade.r_multiple || trade.rMultiple || 0),
        time: new Date(trade.created_at || trade.date).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        direction: trade.direction || 'buy'
      }));

      // Calculate active streak
      let activeStreak = 0;
      for (let i = 0; i < trades.length; i++) {
        if (parseFloat(trades[i].pnl || 0) > 0) {
          activeStreak++;
        } else {
          break;
        }
      }

      setRealDashboardData(prev => ({
        ...prev,
        accounts: accounts.length > 0 ? accounts : prev.accounts,
        todayStats: {
          totalPnL: Math.round(totalPnL * 100) / 100,
          totalTrades,
          winRate: Math.round(winRate * 100) / 100,
          rMultiple: Math.round(averageR * 100) / 100,
          bestTrade: Math.round(bestTrade * 100) / 100,
          worstTrade: Math.round(worstTrade * 100) / 100,
          activeStreak
        },
        recentTrades
      }));

      console.log('Dashboard updated with real data:', { totalTrades, totalPnL, winRate });

    } catch (error) {
      console.error('Error loading real dashboard data:', error);
      setRealDashboardData(dashboardData);
    }
  }, [dashboardData]);

  // Load data on component mount and when trades update
  useEffect(() => {
    loadRealData();

    // Set up global update function
    window.updateDashboardData = loadRealData;

    // Listen for trade updates
    const handleTradeUpdate = () => {
      setTimeout(loadRealData, 100); // Small delay to ensure localStorage is updated
    };

    window.addEventListener('tradesUpdated', handleTradeUpdate);
    window.addEventListener('storage', handleTradeUpdate);

    return () => {
      window.removeEventListener('tradesUpdated', handleTradeUpdate);
      window.removeEventListener('storage', handleTradeUpdate);
      delete window.updateDashboardData;
    };
  }, [loadRealData]);

  // Risk status calculation
  const getRiskStatus = () => {
    const { dailyDrawdown, maxDailyDrawdown, accountDrawdown, maxAccountDrawdown } = realDashboardData.riskMetrics || {};
    
    if (dailyDrawdown >= maxDailyDrawdown * 0.8 || accountDrawdown >= maxAccountDrawdown * 0.8) {
      return 'danger';
    }
    if (dailyDrawdown >= maxDailyDrawdown * 0.6 || accountDrawdown >= maxAccountDrawdown * 0.6) {
      return 'warning';
    }
    return 'safe';
  };

  const riskStatus = getRiskStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
              Trading Dashboard
            </h1>
            <p className="text-white/60">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Account Filter */}
            <TradingInput 
              type="select"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-48"
            >
              <option value="all">All Accounts</option>
              {realDashboardData.accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </TradingInput>

            {/* Refresh Button */}
            <NeonButton
              variant="glass"
              size="sm"
              loading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  loadRealData();
                }, 1000);
              }}
              className="text-white/70 hover:text-white border-white/20 hover:border-white/40"
            >
              <RefreshCw size={16} />
            </NeonButton>
          </div>
        </div>

        {/* Risk Alert Banner */}
        {riskStatus !== 'safe' && (
          <GlassCard variant="medium">
            <div className="p-4 border-l-4 border-amber-500">
              <div className="flex items-center">
                <AlertTriangle size={18} className={`mr-3 ${
                  riskStatus === 'danger' ? 'text-red-400' : 'text-amber-400'
                }`} />
                <div>
                  <span className="font-medium text-white">
                    {riskStatus === 'danger' ? 'Critical Risk Alert' : 'Risk Warning'}
                  </span>
                  <p className="text-sm text-white/70 mt-1">
                    {riskStatus === 'danger' 
                      ? 'You are approaching critical drawdown limits. Consider reducing position sizes.'
                      : 'You are approaching drawdown limits. Trade with increased caution.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's P&L */}
          <GlassCard variant="medium">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm font-medium">Today's P&L</span>
                <DollarSign size={18} className="text-white/50" />
              </div>
              <div className={`text-3xl font-bold ${
                realDashboardData.todayStats.totalPnL > 0 
                  ? 'text-emerald-400' 
                  : realDashboardData.todayStats.totalPnL < 0 
                    ? 'text-red-400' 
                    : 'text-white'
              }`}>
                {realDashboardData.todayStats.totalPnL > 0 ? '+' : ''}$
                {realDashboardData.todayStats.totalPnL.toLocaleString()}
              </div>
              <div className="text-sm text-white/60 mt-1">
                {realDashboardData.todayStats.totalTrades} trades
              </div>
            </div>
          </GlassCard>

          {/* Win Rate */}
          <GlassCard variant="medium">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm font-medium">Win Rate</span>
                <Target size={18} className="text-white/50" />
              </div>
              <div className="text-3xl font-bold text-white">
                {realDashboardData.todayStats.winRate}%
              </div>
              <div className="text-sm text-white/60 mt-1">
                Streak: {realDashboardData.todayStats.activeStreak}
              </div>
            </div>
          </GlassCard>

          {/* R-Multiple */}
          <GlassCard variant="medium">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm font-medium">R-Multiple</span>
                <Activity size={18} className="text-white/50" />
              </div>
              <div className={`text-3xl font-bold ${
                realDashboardData.todayStats.rMultiple > 0 
                  ? 'text-emerald-400' 
                  : realDashboardData.todayStats.rMultiple < 0 
                    ? 'text-red-400' 
                    : 'text-white'
              }`}>
                {realDashboardData.todayStats.rMultiple > 0 ? '+' : ''}
                {realDashboardData.todayStats.rMultiple.toFixed(2)}R
              </div>
              <div className="text-sm text-white/60 mt-1">
                Risk-reward ratio
              </div>
            </div>
          </GlassCard>

          {/* Risk Status */}
          <GlassCard variant="medium">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/70 text-sm font-medium">Risk Status</span>
                <Shield size={18} className={`${
                  riskStatus === 'safe' ? 'text-emerald-400' : 
                  riskStatus === 'warning' ? 'text-amber-400' : 'text-red-400'
                }`} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Daily DD:</span>
                  <span className="font-medium text-white">
                    {realDashboardData.riskMetrics?.dailyDrawdown?.toFixed(1) || '0.0'}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Account DD:</span>
                  <span className="font-medium text-white">
                    {realDashboardData.riskMetrics?.accountDrawdown?.toFixed(1) || '0.0'}%
                  </span>
                </div>
              </div>
              <div className="text-sm text-white/60 mt-2">
                Account safety
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Trading Calendar - Full Width */}
        <GlassCard title="Trading Calendar" subtitle="Daily P&L overview with interactive filtering" icon={Calendar}>
          <TradingCalendar />
        </GlassCard>
        {/* Account Overview & Recent Trades */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Account Overview */}
          <div className="lg:col-span-2">
            <GlassCard title="Prop Firm Accounts" subtitle="Account balances and limits" icon={Shield}>
              <div className="p-6 space-y-4">
                {realDashboardData.accounts.map((account) => (
                  <div key={account.id} className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">
                          {account.name}
                        </div>
                        <div className="text-sm text-white/60">
                          {account.firm}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          ${account.balance.toLocaleString()}
                        </div>
                        <div className="text-sm text-white/60">
                          Daily Limit: ${account.dailyLimit.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Recent Trades */}
          <div>
            <GlassCard title="Recent Trades" subtitle="Latest executions" icon={Activity}>
              <div className="p-6 space-y-3">
                {realDashboardData.recentTrades.map((trade) => (
                  <div key={trade.id} className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-white">
                          {trade.pair}
                        </div>
                        <div className="text-xs text-white/60">
                          {(trade.direction || 'BUY').toUpperCase()} • {trade.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium text-sm ${
                          trade.pnl > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {trade.pnl > 0 ? '+' : ''}${trade.pnl}
                        </div>
                        <div className="text-xs text-white/60">
                          {trade.rMultiple > 0 ? '+' : ''}{trade.rMultiple}R
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center space-x-6">
          <NeonButton 
            variant="glass" 
            size="lg"
            onClick={() => {
              // Trigger the main App's trade form
              if (window.openTradeForm) {
                window.openTradeForm();
              } else {
                // Fallback: dispatch custom event
                window.dispatchEvent(new CustomEvent('openTradeForm'));
              }
            }}
            className="text-white/50 hover:text-white/80 border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <Plus size={18} className="mr-2" />
            Add Trade
          </NeonButton>
          
          <NeonButton 
            variant="glass" 
            size="lg"
            onClick={() => {
              // Navigate to analytics
              if (window.navigateToPage) {
                window.navigateToPage('analytics');
              } else {
                window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'analytics' }));
              }
            }}
            className="text-white/50 hover:text-white/80 border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <BarChart3 size={18} className="mr-2" />
            Analytics
          </NeonButton>
          
          <NeonButton 
            variant="glass" 
            size="lg"
            onClick={() => {
              if (window.navigateToPage) {
                window.navigateToPage('daily-journal');
              } else {
                window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'daily-journal' }));
              }
            }}
            className="text-white/50 hover:text-white/80 border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <Calendar size={18} className="mr-2" />
            Daily Journal
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;