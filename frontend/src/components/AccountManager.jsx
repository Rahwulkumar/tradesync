import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Target,
  Plus,
  Edit,
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Clock,
  Calendar,
  X
} from 'lucide-react';
import GlassCard from './ui/GlassCard';
import NeonButton from './ui/NeonButton';

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState({});
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount] = useState({
    name: '', 
    propFirm: '', 
    accountType: '', 
    initialBalance: '',
    maxDailyLoss: '', 
    maxTotalLoss: '', 
    profitTarget: '', 
    minTradingDays: ''
  });

  const propFirms = [
    'FTMO', 
    'Apex Trader Funding', 
    'MyForexFunds', 
    'The5%ers',
    'FundedNext', 
    'TrueForexFunds', 
    'Surge Trader', 
    'TopStepTrader'
  ];

  const getRiskStatus = (account) => {
    const { dailyDrawdown, totalDrawdown } = account.metrics;
    
    if (dailyDrawdown > 4 || totalDrawdown > 8) return 'danger';
    if (dailyDrawdown > 3 || totalDrawdown > 6) return 'warning';
    return 'safe';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-emerald-400';
      case 'passed': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      case 'pending': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.propFirm || !newAccount.initialBalance) return;
    
    const account = {
      id: `${newAccount.propFirm.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      ...newAccount,
      initialBalance: parseFloat(newAccount.initialBalance),
      maxDailyLoss: parseFloat(newAccount.maxDailyLoss) || 0,
      maxTotalLoss: parseFloat(newAccount.maxTotalLoss) || 0,
      profitTarget: parseFloat(newAccount.profitTarget) || 0,
      minTradingDays: parseInt(newAccount.minTradingDays) || 0,
      currentBalance: parseFloat(newAccount.initialBalance),
      dailyPnL: 0,
      totalPnL: 0,
      tradingDays: 0,
      phase: newAccount.accountType || 'Active',
      status: 'active',
      rules: {
        minTradingDays: parseInt(newAccount.minTradingDays) || 0,
        profitTarget: parseFloat(newAccount.profitTarget) || 0,
        maxDailyDrawdown: 5,
        maxTotalDrawdown: 10,
        weekendHolding: false,
        newsTrading: false
      },
      metrics: {
        dailyDrawdown: 0,
        totalDrawdown: 0,
        profitProgress: 0
      }
    };

    setAccounts(prev => [...prev, account]);
    setNewAccount({
      name: '', propFirm: '', accountType: '', initialBalance: '',
      maxDailyLoss: '', maxTotalLoss: '', profitTarget: '', minTradingDays: ''
    });
    setShowAddForm(false);
  };
  const toggleDetails = (accountId) => {
    setShowDetails(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Account Manager</h1>
            <p className="text-gray-400">Manage your prop firm accounts</p>
          </div>
        </div>
        <NeonButton
          variant="primary"
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </NeonButton>
      </div>

      {/* Accounts Grid */}
      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {accounts.map((account) => (
            <GlassCard key={account.id} className="p-6">
              {/* Account Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {account.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{account.propFirm}</span>
                    <span>•</span>
                    <span>{account.accountType}</span>
                    <span className={`ml-2 ${getStatusColor(account.status)} capitalize`}>
                      {account.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleDetails(account.id)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showDetails[account.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Balance & PnL */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Current Balance</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(account.currentBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total P&L</p>
                  <p className={`text-xl font-bold ${
                    account.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {account.totalPnL >= 0 ? '+' : ''}{formatCurrency(account.totalPnL)}
                  </p>
                </div>
              </div>

              {/* Daily PnL */}
              <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-gray-400">Today's P&L</span>
                <div className="flex items-center gap-2">
                  {account.dailyPnL >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`font-semibold ${
                    account.dailyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {account.dailyPnL >= 0 ? '+' : ''}{formatCurrency(account.dailyPnL)}
                  </span>
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">Daily Drawdown</span>
                    {getRiskStatus(account) === 'danger' && <AlertTriangle className="w-3 h-3 text-red-400" />}
                    {getRiskStatus(account) === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                    {getRiskStatus(account) === 'safe' && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        account.metrics.dailyDrawdown > 4 ? 'bg-red-500' :
                        account.metrics.dailyDrawdown > 3 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(account.metrics.dailyDrawdown * 20, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatPercentage(account.metrics.dailyDrawdown)} / 5%
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">Total Drawdown</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        account.metrics.totalDrawdown > 8 ? 'bg-red-500' :
                        account.metrics.totalDrawdown > 6 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(account.metrics.totalDrawdown * 10, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatPercentage(account.metrics.totalDrawdown)} / 10%
                  </span>
                </div>
              </div>

              {/* Profit Target Progress */}
              {account.rules?.profitTarget && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Profit Target</span>
                    <span className="text-sm text-white">
                      {formatCurrency(account.totalPnL)} / {formatCurrency(account.rules.profitTarget)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ 
                        width: `${Math.min((account.totalPnL / account.rules.profitTarget) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatPercentage((account.totalPnL / account.rules.profitTarget) * 100)} complete
                  </span>
                </div>
              )}

              {/* Trading Days */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">Trading Days:</span>
                  <span className="text-white">{account.tradingDays}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">Phase:</span>
                  <span className="text-white">{account.phase}</span>
                </div>
              </div>

              {/* Detailed Rules (Collapsible) */}
              {showDetails[account.id] && account.rules && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Account Rules
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Min Trading Days:</span>
                      <span className="text-white">{account.rules.minTradingDays}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Profit Target:</span>
                      <span className="text-white">{formatCurrency(account.rules.profitTarget)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Max Daily DD:</span>
                      <span className="text-white">{account.rules.maxDailyDrawdown}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Max Total DD:</span>
                      <span className="text-white">{account.rules.maxTotalDrawdown}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Weekend Holding:</span>
                      <span className={account.rules.weekendHolding ? 'text-emerald-400' : 'text-red-400'}>
                        {account.rules.weekendHolding ? 'Allowed' : 'Not Allowed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">News Trading:</span>
                      <span className={account.rules.newsTrading ? 'text-emerald-400' : 'text-red-400'}>
                        {account.rules.newsTrading ? 'Allowed' : 'Not Allowed'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-12">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Accounts Yet</h3>
            <p className="text-gray-400 mb-6">Add your first prop firm account to get started</p>
            <NeonButton
              variant="primary"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Your First Account
            </NeonButton>
          </div>
        </GlassCard>
      )}

      {/* Add Account Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Add New Account</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., FTMO Challenge #1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prop Firm
                  </label>
                  <select
                    value={newAccount.propFirm}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, propFirm: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  >
                    <option value="" className="bg-gray-800">Select Prop Firm</option>
                    {propFirms.map(firm => (
                      <option key={firm} value={firm} className="bg-gray-800">{firm}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Type
                  </label>
                  <input
                    type="text"
                    value={newAccount.accountType}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, accountType: e.target.value }))}
                    placeholder="e.g., Challenge, Evaluation, Funded"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Initial Balance
                  </label>
                  <input
                    type="number"
                    value={newAccount.initialBalance}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, initialBalance: e.target.value }))}
                    placeholder="100000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Daily Loss
                  </label>
                  <input
                    type="number"
                    value={newAccount.maxDailyLoss}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, maxDailyLoss: e.target.value }))}
                    placeholder="5000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Total Loss
                  </label>
                  <input
                    type="number"
                    value={newAccount.maxTotalLoss}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, maxTotalLoss: e.target.value }))}
                    placeholder="10000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profit Target
                  </label>
                  <input
                    type="number"
                    value={newAccount.profitTarget}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, profitTarget: e.target.value }))}
                    placeholder="10000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Min Trading Days
                  </label>
                  <input
                    type="number"
                    value={newAccount.minTradingDays}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, minTradingDays: e.target.value }))}
                    placeholder="4"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <NeonButton
                  variant="secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </NeonButton>
                <NeonButton
                  variant="primary"
                  onClick={handleAddAccount}
                  disabled={!newAccount.name || !newAccount.propFirm || !newAccount.initialBalance}
                >
                  Add Account
                </NeonButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManager;