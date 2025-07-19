// 🎯 StrategyManager.jsx - Professional Strategy Management System
// Location: components/StrategyManager.jsx

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  AlertTriangle,
  BookOpen,
  Eye,
  EyeOff,
  Save,
  X,
  Star,
  Activity
} from 'lucide-react';
import GlassCard from './ui/GlassCard';
import NeonButton from './ui/NeonButton';
import GlassInput from './ui/GlassInput';

const StrategyManager = () => {
  const [strategies, setStrategies] = useState([
    {
      id: 1,
      strategy_name: 'ICT Concepts',
      description: 'Institutional trading concepts based on smart money movements',
      rules: [
        'Only trade during London/NY sessions',
        'Wait for liquidity grab before entry',
        'Use order blocks for precise entries',
        'Risk maximum 1% per trade',
        'Target minimum 1:2 risk-reward ratio'
      ],
      performance: {
        totalTrades: 45,
        winningTrades: 33,
        losingTrades: 12,
        winRate: 73.3,
        totalPnL: 6250,
        averageWin: 285,
        averageLoss: -125,
        averageRMultiple: 2.1,
        profitFactor: 2.8,
        maxDrawdown: 3.2,
        bestTrade: 850,
        worstTrade: -275
      },
      recentTrades: [
        { date: '2024-01-15', pair: 'EURUSD', pnl: 625, rMultiple: 2.1 },
        { date: '2024-01-14', pair: 'GBPJPY', pnl: 450, rMultiple: 1.8 },
        { date: '2024-01-12', pair: 'USDJPY', pnl: -125, rMultiple: -0.5 }
      ],
      tags: ['ICT', 'Smart Money', 'Institutional'],
      isActive: true,
      createdDate: '2023-12-01',
      lastUsed: '2024-01-15'
    },
    {
      id: 2,
      strategy_name: 'Supply & Demand',
      description: 'Trading based on key supply and demand zones with confluence',
      rules: [
        'Identify fresh supply/demand zones',
        'Look for multiple timeframe confluence',
        'Enter on first touch of zone',
        'Use tight stops above/below zone',
        'Scale out at key levels'
      ],
      performance: {
        totalTrades: 32,
        winningTrades: 21,
        losingTrades: 11,
        winRate: 65.6,
        totalPnL: 3850,
        averageWin: 245,
        averageLoss: -155,
        averageRMultiple: 1.8,
        profitFactor: 2.2,
        maxDrawdown: 4.1,
        bestTrade: 720,
        worstTrade: -320
      },
      recentTrades: [
        { date: '2024-01-15', pair: 'GBPJPY', pnl: 450, rMultiple: 1.5 },
        { date: '2024-01-13', pair: 'AUDUSD', pnl: 280, rMultiple: 1.9 },
        { date: '2024-01-11', pair: 'EURUSD', pnl: -155, rMultiple: -1.0 }
      ],
      tags: ['Supply', 'Demand', 'Zones'],
      isActive: true,
      createdDate: '2023-11-15',
      lastUsed: '2024-01-15'
    },
    {
      id: 3,
      strategy_name: 'Breakout Trading',
      description: 'Trading confirmed breakouts with volume and momentum',
      rules: [
        'Wait for clean breakout of key levels',
        'Confirm with volume increase',
        'Enter on retest of broken level',
        'Use previous resistance as support',
        'Exit if level fails to hold'
      ],
      performance: {
        totalTrades: 22,
        winningTrades: 12,
        losingTrades: 10,
        winRate: 54.5,
        totalPnL: 597,
        averageWin: 185,
        averageLoss: -165,
        averageRMultiple: 1.2,
        profitFactor: 1.4,
        maxDrawdown: 6.8,
        bestTrade: 425,
        worstTrade: -280
      },
      recentTrades: [
        { date: '2024-01-16', pair: 'USDJPY', pnl: -200, rMultiple: -0.8 },
        { date: '2024-01-10', pair: 'GBPUSD', pnl: 320, rMultiple: 1.6 },
        { date: '2024-01-08', pair: 'EURUSD', pnl: 185, rMultiple: 1.1 }
      ],
      tags: ['Breakout', 'Momentum', 'Volume'],
      isActive: false,
      createdDate: '2023-10-20',
      lastUsed: '2024-01-16'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [expandedStrategies, setExpandedStrategies] = useState({});
  
  const [newStrategy, setNewStrategy] = useState({
    strategy_name: '',
    description: '',
    rules: [''],
    tags: []
  });

  const addRule = () => {
    setNewStrategy(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const updateRule = (index, value) => {
    setNewStrategy(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const removeRule = (index) => {
    setNewStrategy(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

   useEffect(() => {
    const loadStrategies = () => {
      try {
        const savedStrategies = JSON.parse(localStorage.getItem('tradesync_strategies') || '[]');
        if (savedStrategies.length > 0) {
          setStrategies(savedStrategies);
          console.log('Loaded saved strategies:', savedStrategies.length);
        }
      } catch (error) {
        console.error('Error loading strategies:', error);
      }
    };

    loadStrategies();
  }, []);

  const handleSaveStrategy = () => {
    if (!newStrategy.strategy_name.trim()) {
      alert('Please enter a strategy name');
      return;
    }

    if (newStrategy.rules.every(rule => !rule.trim())) {
      alert('Please add at least one trading rule');
      return;
    }

    const strategy = {
      id: editingStrategy ? editingStrategy.id : `strategy_${Date.now()}`,
      strategy_name: newStrategy.strategy_name.trim(),
      description: newStrategy.description || '',
      rules: newStrategy.rules.filter(rule => rule.trim() !== ''),
      tags: newStrategy.tags || [],
      performance: editingStrategy ? editingStrategy.performance : {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalPnL: 0,
        averageWin: 0,
        averageLoss: 0,
        averageRMultiple: 0,
        profitFactor: 0,
        maxDrawdown: 0,
        bestTrade: 0,
        worstTrade: 0
      },
      recentTrades: editingStrategy ? editingStrategy.recentTrades : [],
      isActive: true,
      createdDate: editingStrategy ? editingStrategy.createdDate : new Date().toISOString().split('T')[0],
      lastUsed: editingStrategy ? editingStrategy.lastUsed : null
    };

    let updatedStrategies;
    if (editingStrategy) {
      updatedStrategies = strategies.map(s => s.id === editingStrategy.id ? strategy : s);
    } else {
      updatedStrategies = [...strategies, strategy];
    }

    setStrategies(updatedStrategies);

    // Save to localStorage
    try {
      localStorage.setItem('tradesync_strategies', JSON.stringify(updatedStrategies));
      console.log('Strategy saved:', strategy);
      alert(editingStrategy ? 'Strategy updated successfully!' : 'Strategy created successfully!');
    } catch (error) {
      console.error('Error saving strategy:', error);
      alert('Error saving strategy');
    }

    // Reset form
    setNewStrategy({ strategy_name: '', description: '', rules: [''], tags: [] });
    setShowAddForm(false);
    setEditingStrategy(null);
  };

  const handleEditStrategy = (strategy) => {
    setEditingStrategy(strategy);
    setNewStrategy({
      strategy_name: strategy.strategy_name,
      description: strategy.description,
      rules: [...strategy.rules],
      tags: [...strategy.tags]
    });
    setShowAddForm(true);
  };

  const toggleStrategyActive = (strategyId) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === strategyId 
        ? { ...strategy, isActive: !strategy.isActive }
        : strategy
    ));
  };

  const deleteStrategy = (strategyId) => {
    if (window.confirm('Are you sure you want to delete this strategy?')) {
      setStrategies(prev => prev.filter(strategy => strategy.id !== strategyId));
    }
  };

  const toggleExpanded = (strategyId) => {
    setExpandedStrategies(prev => ({
      ...prev,
      [strategyId]: !prev[strategyId]
    }));
  };

  const getPerformanceColor = (value, type) => {
    switch (type) {
      case 'winRate':
        return value >= 70 ? 'text-green-600 dark:text-green-400' :
               value >= 50 ? 'text-amber-600 dark:text-amber-400' :
               'text-red-600 dark:text-red-400';
      case 'pnl':
        return value > 0 ? 'text-green-600 dark:text-green-400' :
               value < 0 ? 'text-red-600 dark:text-red-400' :
               'text-gray-600 dark:text-gray-400';
      case 'profitFactor':
        return value >= 2 ? 'text-green-600 dark:text-green-400' :
               value >= 1.5 ? 'text-amber-600 dark:text-amber-400' :
               'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRiskRating = (strategy) => {
    const { winRate, profitFactor, maxDrawdown } = strategy.performance;
    
    let score = 0;
    if (winRate >= 70) score += 3;
    else if (winRate >= 50) score += 2;
    else score += 1;
    
    if (profitFactor >= 2) score += 3;
    else if (profitFactor >= 1.5) score += 2;
    else score += 1;
    
    if (maxDrawdown <= 3) score += 3;
    else if (maxDrawdown <= 5) score += 2;
    else score += 1;
    
    if (score >= 8) return { rating: 'Low Risk', color: 'text-green-600 dark:text-green-400', stars: 5 };
    if (score >= 6) return { rating: 'Medium Risk', color: 'text-amber-600 dark:text-amber-400', stars: 3 };
    return { rating: 'High Risk', color: 'text-red-600 dark:text-red-400', stars: 1 };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Strategy Manager
            </h1>
            <p className="text-gray-400">
              Organize, track, and analyze your trading strategies
            </p>
          </div>
          
          <NeonButton 
            size="lg"
            onClick={() => {
              setShowAddForm(true);
              setEditingStrategy(null);
              setNewStrategy({ strategy_name: '', description: '', rules: [''], tags: [] });
            }}
          >
            <Plus size={20} className="mr-2" />
            Add Strategy
          </NeonButton>
        </div>
        
        {/* Subtle separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Strategy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Strategies</p>
              <p className="text-2xl font-bold text-white mt-1">
                {strategies.length}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {strategies.filter(s => s.isActive).length} active
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Best Performer</p>
              <p className="text-lg font-bold text-white mt-1 truncate">
                {strategies.reduce((best, current) => 
                  current.performance.totalPnL > best.performance.totalPnL ? current : best
                ).strategy_name}
              </p>
              <p className="text-emerald-400 text-sm mt-1">
                ${strategies.reduce((best, current) => 
                  current.performance.totalPnL > best.performance.totalPnL ? current : best
                ).performance.totalPnL.toLocaleString()}
              </p>
            </div>
            <Award className="w-8 h-8 text-emerald-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Combined P&L</p>
              <p className={`text-2xl font-bold mt-1 ${
                strategies.reduce((sum, s) => sum + s.performance.totalPnL, 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                ${strategies.reduce((sum, s) => sum + s.performance.totalPnL, 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 ${
              strategies.reduce((sum, s) => sum + s.performance.totalPnL, 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Trades</p>
              <p className="text-2xl font-bold text-white mt-1">
                {strategies.reduce((sum, s) => sum + s.performance.totalTrades, 0)}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                All strategies combined
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {strategies.map((strategy) => {
          const isExpanded = expandedStrategies[strategy.id];
          const riskData = getRiskRating(strategy);
          
          return (
            <GlassCard key={strategy.id} className="p-6">
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {strategy.strategy_name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {strategy.description}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    strategy.isActive 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {strategy.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                {/* Subtle separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                {/* Performance Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Total P&L</div>
                    <div className={`text-xl font-bold ${getPerformanceColor(strategy.performance.totalPnL, 'pnl')}`}>
                      {strategy.performance.totalPnL > 0 ? '+' : ''}${strategy.performance.totalPnL.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                    <div className={`text-xl font-bold ${getPerformanceColor(strategy.performance.winRate, 'winRate')}`}>
                      {strategy.performance.winRate.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-gray-400">Trades</div>
                    <div className="font-medium text-white">
                      {strategy.performance.totalTrades}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">Avg R</div>
                    <div className={`font-medium ${getPerformanceColor(strategy.performance.averageRMultiple, 'pnl')}`}>
                      {strategy.performance.averageRMultiple.toFixed(1)}R
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">PF</div>
                    <div className={`font-medium ${getPerformanceColor(strategy.performance.profitFactor, 'profitFactor')}`}>
                      {strategy.performance.profitFactor.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Risk Rating */}
                <div className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <span className="text-sm text-gray-400">Risk Rating:</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${riskData.color}`}>
                      {riskData.rating}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < riskData.stars ? riskData.color : 'text-gray-600'} 
                          fill={i < riskData.stars ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {strategy.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {strategy.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    
                    {/* Rules */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">
                        Trading Rules
                      </h4>
                      <ul className="space-y-1">
                        {strategy.rules.map((rule, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-gray-400">
                            <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recent Trades */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">
                        Recent Trades
                      </h4>
                      <div className="space-y-2">
                        {strategy.recentTrades.slice(0, 3).map((trade, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">
                              {trade.date} • {trade.pair}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium ${getPerformanceColor(trade.pnl, 'pnl')}`}>
                                {trade.pnl > 0 ? '+' : ''}${trade.pnl}
                              </span>
                              <span className="text-gray-500">
                                {trade.rMultiple > 0 ? '+' : ''}{trade.rMultiple}R
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Performance */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">
                        Performance Details
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-400">Avg Win:</span>
                          <div className="font-medium text-emerald-400">
                            ${strategy.performance.averageWin}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Avg Loss:</span>
                          <div className="font-medium text-red-400">
                            ${strategy.performance.averageLoss}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Best Trade:</span>
                          <div className="font-medium text-emerald-400">
                            ${strategy.performance.bestTrade}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Worst Trade:</span>
                          <div className="font-medium text-red-400">
                            ${strategy.performance.worstTrade}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Max DD:</span>
                          <div className="font-medium text-amber-400">
                            {strategy.performance.maxDrawdown}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Last Used:</span>
                          <div className="font-medium text-gray-400">
                            {strategy.lastUsed ? new Date(strategy.lastUsed).toLocaleDateString() : 'Never'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <NeonButton
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(strategy.id)}
                    >
                      {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
                    </NeonButton>
                    
                    <NeonButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStrategy(strategy)}
                    >
                      <Edit size={14} />
                    </NeonButton>
                    
                    <NeonButton
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteStrategy(strategy.id)}
                    >
                      <Trash2 size={14} />
                    </NeonButton>
                  </div>

                  <NeonButton
                    variant={strategy.isActive ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => toggleStrategyActive(strategy.id)}
                  >
                    {strategy.isActive ? 'Deactivate' : 'Activate'}
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Add/Edit Strategy Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {editingStrategy ? 'Edit Strategy' : 'Add New Strategy'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingStrategy(null);
                  }}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4">
                <GlassInput
                  label="Strategy Name"
                  value={newStrategy.strategy_name}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, strategy_name: e.target.value }))}
                  placeholder="e.g., ICT Concepts, Supply & Demand"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={newStrategy.description}
                    onChange={(e) => setNewStrategy(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your trading strategy..."
                    className="w-full p-3 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
              </div>

              {/* Trading Rules */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-white">
                    Trading Rules
                  </label>
                  <NeonButton
                    variant="ghost"
                    size="sm"
                    onClick={addRule}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Rule
                  </NeonButton>
                </div>
                
                <div className="space-y-3">
                  {newStrategy.rules.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => updateRule(index, e.target.value)}
                        placeholder={`Rule ${index + 1}...`}
                        className="flex-1 p-3 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {newStrategy.rules.length > 1 && (
                        <NeonButton
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRule(index)}
                        >
                          <Trash2 size={16} />
                        </NeonButton>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <NeonButton
                  size="lg"
                  onClick={handleSaveStrategy}
                  disabled={!newStrategy.strategy_name.trim() || newStrategy.rules.every(rule => !rule.trim())}
                  className="flex-1"
                >
                  <Save size={16} className="mr-2" />
                  {editingStrategy ? 'Update Strategy' : 'Save Strategy'}
                </NeonButton>
                
                <NeonButton
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingStrategy(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default StrategyManager;