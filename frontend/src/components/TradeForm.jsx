import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Camera,
  Clock,
  Brain,
  ChevronDown,
  RefreshCw,
  BarChart,
  Eye,
  X,
  Plus,
  Trash2,
  Shield,
  Zap,
  Activity
} from 'lucide-react';
import GlassCard from './ui/GlassCard';
import NeonButton from './ui/NeonButton';
import TradingInput from './ui/TradingInput';
import { theme } from '../theme/theme';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TradeForm = ({ isOpen, onClose, onSubmit, editingTrade = null }) => {
  const [trade, setTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    entry_datetime: '',
    exit_datetime: '',
    instrument: '',
    direction: 'long',
    entry_price: '',
    exit_price: '',
    size: '',
    fees: '0',
    account: '',
    stop_loss: '',
    take_profit: '',
    trade_type: '',
    rationale: '',
    tags: '',
    pre_emotion: '',
    post_reflection: '',
    risk_amount: '',
    strategy_tag: '',
    rules_followed: [],
    timeframe_analysis: [],
    isLiveTrade: false,
    isClosed: false,
  });

  const [calculations, setCalculations] = useState({
    pnl: 0,
    rMultiple: 0,
    riskPercent: 0,
    rewardRiskRatio: 0,
    positionSize: 0
  });

  const [validation, setValidation] = useState({
    errors: {},
    warnings: [],
    riskStatus: 'safe'
  });

  const [screenshots, setScreenshots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('5m');
  const [showChart, setShowChart] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceTimestamp, setPriceTimestamp] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [strategies, setStrategies] = useState([]);

  const weeklyBiasOptions = {
    EUR: ['Bullish on EUR', 'Watch ECB news', 'Monitor EURUSD support'],
    USD: ['Dovish Fed outlook', 'NFP week', 'USD Index at resistance'],
    GBP: ['Brexit headlines', 'BOE meeting', 'GBPUSD trend'],
    JPY: ['BOJ intervention risk', 'Yen safe haven flows'],
  };

  const strategyChecklists = {
    'ICT Concepts': [
      'Check market structure',
      'Identify order blocks',
      'Confirm liquidity sweep',
      'Set FVG targets'
    ],
    'Supply & Demand': [
      'Mark supply zones',
      'Mark demand zones',
      'Wait for confirmation candle',
      'Check higher timeframe alignment'
    ],
    'Price Action': [
      'Identify key S/R levels',
      'Look for price action signals',
      'Check for fakeouts'
    ],
    'Breakout': [
      'Draw breakout levels',
      'Wait for retest',
      'Confirm with volume'
    ],
  };

  const emotionTags = [
    'Confident', 'Nervous', 'Excited', 'Calm', 'Anxious', 'Focused', 'Impatient', 'Disciplined'
  ];

  const timeframes = [
    { key: '5m', label: '5 Minutes', value: '5min' },
    { key: '15m', label: '15 Minutes', value: '15min' },
    { key: '1h', label: '1 Hour', value: '1H' },
    { key: '4h', label: '4 Hours', value: '4H' }
  ];

  const [weeklyBiasChecklist, setWeeklyBiasChecklist] = useState({});
  const [strategyChecklist, setStrategyChecklist] = useState({});
  const [timeframeInput, setTimeframeInput] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (editingTrade) {
      setTrade({
        ...editingTrade,
        date: editingTrade.date || new Date().toISOString().split('T')[0],
        entry_datetime: editingTrade.entry_datetime || '',
        exit_datetime: editingTrade.exit_datetime || '',
        instrument: editingTrade.instrument || '',
        direction: editingTrade.direction || 'long',
        entry_price: editingTrade.entry_price || '',
        exit_price: editingTrade.exit_price || '',
        size: editingTrade.size || '',
        fees: editingTrade.fees || '0',
        account: editingTrade.account || '',
        stop_loss: editingTrade.stop_loss || '',
        take_profit: editingTrade.take_profit || '',
        trade_type: editingTrade.trade_type || '',
        rationale: editingTrade.rationale || '',
        tags: editingTrade.tags || '',
        pre_emotion: editingTrade.pre_emotion || '',
        post_reflection: editingTrade.post_reflection || '',
        risk_amount: editingTrade.risk_amount || '',
        strategy_tag: editingTrade.strategy_tag || '',
        rules_followed: editingTrade.rules_followed || [],
        timeframe_analysis: editingTrade.timeframe_analysis || [],
        isLiveTrade: editingTrade.isLiveTrade || false,
        isClosed: editingTrade.isClosed || false,
      });
      
      if (editingTrade.screenshots) {
        setScreenshots(editingTrade.screenshots);
      }
      
      if (editingTrade.weeklyBiasChecklist) {
        setWeeklyBiasChecklist(editingTrade.weeklyBiasChecklist);
      }
      
      if (editingTrade.strategyChecklist) {
        setStrategyChecklist(editingTrade.strategyChecklist);
      }
    }
  }, [editingTrade]);

  useEffect(() => {
    calculateMetrics();
  }, [trade.entry_price, trade.exit_price, trade.size, trade.direction, trade.risk_amount, trade.account]);

  useEffect(() => {
    validatePropFirmRules();
  }, [trade, calculations]);

  useEffect(() => {
    const instrument = trade.instrument;
    if (instrument && instrument.length >= 3) {
      const currency = instrument.slice(0, 3).toUpperCase();
      const options = weeklyBiasOptions[currency] || [];
      setWeeklyBiasChecklist(
        options.reduce((acc, item) => ({ ...acc, [item]: false }), {})
      );
    } else {
      setWeeklyBiasChecklist({});
    }
  }, [trade.instrument]);

  useEffect(() => {
    const strategy = trade.strategy_tag;
    const options = strategyChecklists[strategy] || [];
    setStrategyChecklist(
      options.reduce((acc, item) => ({ ...acc, [item]: false }), {})
    );
  }, [trade.strategy_tag]);

  const fetchInitialData = async () => {
    try {
      const [accountsResponse, strategiesResponse] = await Promise.all([
        fetch('http://localhost:8000/accounts/'),
        fetch('http://localhost:8000/strategies/')
      ]);

      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json();
        setAccounts(accountsData);
      }

      if (strategiesResponse.ok) {
        const strategiesData = await strategiesResponse.json();
        setStrategies(strategiesData);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchCurrentPrice = async (instrument) => {
    if (!instrument) return;
    
    setCurrentPrice(null);
    setPriceTimestamp(null);
    
    try {
      const response = await fetch(`http://localhost:8000/api/live-price/${instrument}`);
      const data = await response.json();
      
      if (data.success) {
        setCurrentPrice(data.data.mid);
        setPriceTimestamp(new Date().toLocaleTimeString());
      } else {
        throw new Error('API returned error');
      }
    } catch (error) {
      console.log('Live price API not available - price updates disabled');
      setCurrentPrice(0);
      setPriceTimestamp('API not available');
    }
  };

  const calculateMetrics = useCallback(() => {
    const { entry_price, exit_price, size, direction, risk_amount, account } = trade;
    
    if (!entry_price || !exit_price || !size) {
      setCalculations({ pnl: 0, rMultiple: 0, riskPercent: 0, rewardRiskRatio: 0, positionSize: 0 });
      return;
    }

    const entryPrice = parseFloat(entry_price);
    const exitPrice = parseFloat(exit_price);
    const tradeSize = parseFloat(size);
    const riskAmount = parseFloat(risk_amount) || 0;

    let pnl = 0;
    if (direction === 'long') {
      pnl = (exitPrice - entryPrice) * tradeSize;
    } else {
      pnl = (entryPrice - exitPrice) * tradeSize;
    }

    const rMultiple = riskAmount > 0 ? pnl / riskAmount : 0;

    const selectedAccount = accounts.find(acc => acc.account_name === account);
    const riskPercent = selectedAccount && riskAmount > 0 
      ? (riskAmount / selectedAccount.capital_size) * 100 
      : 0;

    const rewardRiskRatio = riskAmount > 0 ? Math.abs(pnl) / riskAmount : 0;

    setCalculations({
      pnl: parseFloat(pnl.toFixed(2)),
      rMultiple: parseFloat(rMultiple.toFixed(2)),
      riskPercent: parseFloat(riskPercent.toFixed(2)),
      rewardRiskRatio: parseFloat(rewardRiskRatio.toFixed(2)),
      positionSize: tradeSize
    });
  }, [trade, accounts]);

  const validatePropFirmRules = useCallback(() => {
    const errors = {};
    const warnings = [];
    let riskStatus = 'safe';

    const selectedAccount = accounts.find(acc => acc.account_name === trade.account);
    
    if (selectedAccount && calculations.riskPercent > 0) {
      if (calculations.riskPercent > 2) {
        errors.risk = 'Risk exceeds 2% of account balance - violates prop firm rules';
        riskStatus = 'danger';
      } else if (calculations.riskPercent > 1.5) {
        warnings.push('Risk approaching 2% limit - consider reducing position size');
        riskStatus = 'warning';
      }

      const dailyRisk = parseFloat(trade.risk_amount) || 0;
      if (dailyRisk > selectedAccount.capital_size * (selectedAccount.max_daily_drawdown / 100) * 0.8) {
        warnings.push('Approaching daily loss limit');
        riskStatus = 'warning';
      }
    }

    if (calculations.rMultiple < -3) {
      warnings.push('R-Multiple below -3R - consider stricter stop loss');
    }

    if (trade.entry_datetime && trade.exit_datetime) {
      const entryTime = new Date(trade.entry_datetime);
      const exitTime = new Date(trade.exit_datetime);
      
      if (exitTime <= entryTime) {
        errors.timing = 'Exit time must be after entry time';
      }
    }

    setValidation({ errors, warnings, riskStatus });
  }, [trade, calculations, accounts]);

  const calculateOptimalPosition = () => {
    const { entry_price, stop_loss, account } = trade;
    
    if (!entry_price || !stop_loss || !account) return;

    const selectedAccount = accounts.find(acc => acc.account_name === account);
    if (!selectedAccount) return;

    const entryPrice = parseFloat(entry_price);
    const stopLoss = parseFloat(stop_loss);
    const riskAmount = selectedAccount.capital_size * 0.01;
    
    const priceDistance = Math.abs(entryPrice - stopLoss);
    const optimalSize = riskAmount / priceDistance;

    setTrade(prev => ({
      ...prev,
      size: optimalSize.toFixed(2),
      risk_amount: riskAmount.toFixed(2)
    }));
  };

  const handleScreenshotUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploadingScreenshots(true);

    try {
      const uploadPromises = files.map(async (file) => {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
        }
        
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image.`);
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'TradeSync Screenshots');
        
        const response = await fetch('http://localhost:8000/api/upload-screenshot', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        return {
          file,
          preview: URL.createObjectURL(file),
          url: result.url,
          label: '',
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
          size: file.size
        };
      });

      const uploadedScreenshots = await Promise.all(uploadPromises);
      setScreenshots(prev => [...prev, ...uploadedScreenshots]);
      
    } catch (error) {
      console.error('Error uploading screenshots:', error);
      alert(`Error uploading screenshots: ${error.message}`);
    } finally {
      setUploadingScreenshots(false);
    }
  };

  const removeScreenshot = (index) => {
    setScreenshots(prev => {
      const newScreenshots = [...prev];
      if (newScreenshots[index].preview.startsWith('blob:')) {
        URL.revokeObjectURL(newScreenshots[index].preview);
      }
      newScreenshots.splice(index, 1);
      return newScreenshots;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.keys(validation.errors).length > 0) {
      alert('Please fix the validation errors before submitting.');
      return;
    }

    // Basic validation
    if (!trade.instrument || !trade.entry_price || !trade.exit_price || !trade.size || !trade.account) {
      alert('Please fill in all required fields: Instrument, Entry Price, Exit Price, Size, and Account.');
      return;
    }

    setIsSubmitting(true);

    try {
      const tradeData = {
        ...trade,
        weeklyBiasChecklist,
        strategyChecklist,
        screenshots: screenshots.map(s => ({
          url: s.url,
          label: s.label || 'Trade Screenshot',
          uploadedAt: s.uploadedAt,
          originalName: s.originalName,
          size: s.size
        })),
        pnl: calculations.pnl,
        r_multiple: calculations.rMultiple,
        risk_percent: calculations.riskPercent,
        reward_risk_ratio: calculations.rewardRiskRatio,
        position_size: calculations.positionSize,
        // Convert arrays to comma-separated strings if needed
        tags: Array.isArray(trade.tags) ? trade.tags.join(', ') : trade.tags,
        timeframe_analysis: Array.isArray(trade.timeframe_analysis) ? trade.timeframe_analysis.join(', ') : trade.timeframe_analysis.join ? trade.timeframe_analysis.join(', ') : trade.timeframe_analysis,
      };

      await onSubmit(tradeData);
      
      if (!editingTrade) {
        resetForm();
      }
      
      handleClose();
      
    } catch (error) {
      console.error('Error submitting trade:', error);
      alert(`Error submitting trade: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTrade({
      date: new Date().toISOString().split('T')[0],
      entry_datetime: '',
      exit_datetime: '',
      instrument: '',
      direction: 'long',
      entry_price: '',
      exit_price: '',
      size: '',
      fees: '0',
      account: '',
      stop_loss: '',
      take_profit: '',
      trade_type: '',
      rationale: '',
      tags: '',
      pre_emotion: '',
      post_reflection: '',
      risk_amount: '',
      strategy_tag: '',
      rules_followed: [],
      timeframe_analysis: [],
      isLiveTrade: false,
      isClosed: false,
    });
    setScreenshots([]);
    setWeeklyBiasChecklist({});
    setStrategyChecklist({});
    setCurrentPrice(null);
    setPriceTimestamp(null);
    setValidation({ errors: {}, warnings: [], riskStatus: 'safe' });
    setCalculations({ pnl: 0, rMultiple: 0, riskPercent: 0, rewardRiskRatio: 0, positionSize: 0 });
  };

  const handleClose = () => {
    if (!editingTrade) {
      resetForm();
    }
    onClose();
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setTrade(prev => ({ ...prev, [field]: value }));
  };

  const startLiveTrade = () => {
    setTrade(prev => ({
      ...prev,
      isLiveTrade: true,
      entry_datetime: new Date().toISOString(),
      isClosed: false,
      exit_datetime: ''
    }));
  };

  const closeLiveTrade = () => {
    setTrade(prev => ({
      ...prev,
      isClosed: true,
      exit_datetime: new Date().toISOString()
    }));
  };

  const addTimeframe = () => {
    if (timeframeInput && !trade.timeframe_analysis.includes(timeframeInput)) {
      setTrade(prev => ({
        ...prev,
        timeframe_analysis: [...prev.timeframe_analysis, timeframeInput]
      }));
      setTimeframeInput('');
    }
  };

  const removeTimeframe = (tf) => {
    setTrade(prev => ({
      ...prev,
      timeframe_analysis: prev.timeframe_analysis.filter(t => t !== tf)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className="bg-gray-900/90 backdrop-blur-xl border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {editingTrade ? 'Edit Trade' : 'Add New Trade'}
              </h2>
              <p className="text-white/60 mt-1">
                Professional trade logging with prop firm validation
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Live Trade Controls */}
            <div className="mb-6 space-y-4">
              {!trade.isLiveTrade && !trade.isClosed && (
                <div className="flex items-center gap-4">
                  <NeonButton
                    type="button"
                    variant="profit"
                    size="sm"
                    onClick={startLiveTrade}
                    icon={Activity}
                  >
                    Start Live Trade
                  </NeonButton>
                  <span className="text-sm text-white/60">
                    Track a trade in real-time
                  </span>
                </div>
              )}
              
              {trade.isLiveTrade && !trade.isClosed && (
                <GlassCard variant="medium" neon="primary">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white font-medium">Live Trade Active</span>
                      </div>
                      <NeonButton
                        type="button"
                        variant="loss"
                        size="sm"
                        onClick={closeLiveTrade}
                      >
                        Close Trade
                      </NeonButton>
                    </div>
                    <div className="mt-2 flex gap-6 text-sm text-white/60">
                      <span>Entry: {trade.entry_datetime ? new Date(trade.entry_datetime).toLocaleString() : '-'}</span>
                      <span>Exit: {trade.exit_datetime ? new Date(trade.exit_datetime).toLocaleString() : '-'}</span>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Weekly Bias Checklist */}
              {Object.keys(weeklyBiasChecklist).length > 0 && (
                <GlassCard variant="light">
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                      <Brain size={16} />
                      Weekly Bias Checklist ({trade.instrument.slice(0,3).toUpperCase()})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(weeklyBiasChecklist).map(([item, checked]) => (
                        <label key={item} className="flex items-center text-sm text-white/80 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setWeeklyBiasChecklist(prev => ({ ...prev, [item]: !prev[item] }))}
                            className="mr-2 w-4 h-4 rounded bg-white/10 border-white/20"
                            disabled={trade.isClosed}
                          />
                          <span className="break-words">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Strategy Checklist */}
              {Object.keys(strategyChecklist).length > 0 && (
                <GlassCard variant="light">
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                      <Target size={16} />
                      Strategy Checklist ({trade.strategy_tag})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(strategyChecklist).map(([item, checked]) => (
                        <label key={item} className="flex items-center text-sm text-white/80 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setStrategyChecklist(prev => ({ ...prev, [item]: !prev[item] }))}
                            className="mr-2 w-4 h-4 rounded bg-white/10 border-white/20"
                            disabled={trade.isClosed}
                          />
                          <span className="break-words">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Left Column - Main Form Content */}
              <div className="xl:col-span-3 space-y-6">
                {/* Trade Information */}
                <GlassCard title="Trade Information" icon={BarChart}>
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <TradingInput
                        label="Trade Date"
                        type="date"
                        value={trade.date}
                        onChange={handleInputChange('date')}
                        required
                        disabled={trade.isClosed}
                      />
                      
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Account *
                        </label>
                        <select
                          value={trade.account}
                          onChange={handleInputChange('account')}
                          className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                          required
                          disabled={trade.isClosed}
                        >
                          <option value="">Select Account</option>
                          {accounts.map(account => (
                            <option key={account.account_name} value={account.account_name} className="bg-gray-800">
                              {account.account_name} - {account.prop_firm} (${account.capital_size?.toLocaleString()})
                            </option>
                          ))}
                        </select>
                      </div>

                      <TradingInput
                        label="Instrument"
                        value={trade.instrument}
                        onChange={handleInputChange('instrument')}
                        placeholder="e.g., EURUSD, GBPJPY"
                        required
                        disabled={trade.isClosed}
                      />

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Direction *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <NeonButton
                            type="button"
                            variant={trade.direction === 'long' ? 'profit' : 'glass'}
                            size="md"
                            onClick={() => setTrade(prev => ({ ...prev, direction: 'long' }))}
                            disabled={trade.isClosed}
                            icon={TrendingUp}
                          >
                            Long
                          </NeonButton>
                          <NeonButton
                            type="button"
                            variant={trade.direction === 'short' ? 'loss' : 'glass'}
                            size="md"
                            onClick={() => setTrade(prev => ({ ...prev, direction: 'short' }))}
                            disabled={trade.isClosed}
                            icon={TrendingDown}
                          >
                            Short
                          </NeonButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Market Data & Pricing */}
                <GlassCard title="Market Data & Pricing" icon={Activity}>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Current Market Price
                        </label>
                        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                          <span className="text-lg font-mono text-white">
                            {currentPrice ? currentPrice : 'Click fetch to get price'}
                          </span>
                          {priceTimestamp && (
                            <div className="text-xs text-white/40 mt-1">
                              Updated: {priceTimestamp}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <NeonButton
                          type="button"
                          variant="glass"
                          size="sm"
                          onClick={() => fetchCurrentPrice(trade.instrument)}
                          disabled={!trade.instrument}
                          icon={RefreshCw}
                        >
                          Fetch
                        </NeonButton>
                        {currentPrice && (
                          <NeonButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setTrade(prev => ({ ...prev, entry_price: currentPrice }))}
                          >
                            Use as Entry
                          </NeonButton>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Execution Details */}
                <GlassCard title="Execution Details" icon={Zap}>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <TradingInput
                        label="Entry Price"
                        type="number"
                        step="0.00001"
                        value={trade.entry_price}
                        onChange={handleInputChange('entry_price')}
                        prefix="$"
                        required
                        disabled={trade.isClosed}
                      />

                      <TradingInput
                        label="Exit Price"
                        type="number"
                        step="0.00001"
                        value={trade.exit_price}
                        onChange={handleInputChange('exit_price')}
                        prefix="$"
                        required
                        disabled={trade.isClosed}
                      />

                      <TradingInput
                        label="Position Size"
                        type="number"
                        step="0.01"
                        value={trade.size}
                        onChange={handleInputChange('size')}
                        suffix="units"
                        required
                        disabled={trade.isClosed}
                      />

                      <TradingInput
                        label="Stop Loss"
                        type="number"
                        step="0.00001"
                        value={trade.stop_loss}
                        onChange={handleInputChange('stop_loss')}
                        prefix="$"
                        disabled={trade.isClosed}
                      />

                      <TradingInput
                        label="Take Profit"
                        type="number"
                        step="0.00001"
                        value={trade.take_profit}
                        onChange={handleInputChange('take_profit')}
                        prefix="$"
                        disabled={trade.isClosed}
                      />

                      <TradingInput
                        label="Risk Amount"
                        type="number"
                        step="0.01"
                        value={trade.risk_amount}
                        onChange={handleInputChange('risk_amount')}
                        prefix="$"
                        disabled={trade.isClosed}
                      />
                    </div>

                    <div className="mt-6">
                      <NeonButton
                        type="button"
                        variant="glass"
                        size="sm"
                        onClick={calculateOptimalPosition}
                        disabled={!trade.entry_price || !trade.stop_loss || !trade.account || trade.isClosed}
                        icon={Calculator}
                      >
                        Calculate Optimal Position Size
                      </NeonButton>
                    </div>
                  </div>
                </GlassCard>

                {/* Trade Screenshots */}
                <GlassCard title="Trade Screenshots" icon={Camera}>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Upload Screenshots (Charts, Entry/Exit points)
                      </label>
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 hover:border-white/40 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleScreenshotUpload}
                          className="hidden"
                          id="screenshot-upload"
                        />
                        <label htmlFor="screenshot-upload" className="cursor-pointer">
                          <div className="text-center">
                            <Camera size={48} className="mx-auto text-white/40 mb-4" />
                            <p className="text-white/80 font-medium">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-white/40 mt-1">
                              PNG, JPG up to 10MB each • Multiple files supported
                            </p>
                          </div>
                        </label>
                      </div>
                      
                      {uploadingScreenshots && (
                        <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                            <span className="text-sm text-blue-400">
                              Uploading to Google Drive...
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {screenshots.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-white/80 mb-3">
                            Uploaded Screenshots ({screenshots.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {screenshots.map((screenshot, index) => (
                              <div key={index} className="relative group">
                                <div className="relative overflow-hidden rounded-lg border-2 border-white/10">
                                  <img
                                    src={screenshot.preview}
                                    alt={`Screenshot ${index + 1}`}
                                    className="w-full h-32 object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeScreenshot(index)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </button>
                                </div>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    placeholder="Label (e.g., Entry Point)"
                                    value={screenshot.label}
                                    onChange={(e) => {
                                      const newScreenshots = [...screenshots];
                                      newScreenshots[index].label = e.target.value;
                                      setScreenshots(newScreenshots);
                                    }}
                                    className="w-full text-sm p-2 rounded bg-white/5 border border-white/10 text-white placeholder-white/30"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>

                {/* Trading Psychology & Strategy */}
                <GlassCard title="Trading Psychology & Strategy" icon={Brain}>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Strategy
                        </label>
                        <select
                          value={trade.strategy_tag}
                          onChange={handleInputChange('strategy_tag')}
                          className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                          disabled={trade.isClosed}
                        >
                          <option value="">Select Strategy</option>
                          {Object.keys(strategyChecklists).map(strategy => (
                            <option key={strategy} value={strategy} className="bg-gray-800">
                              {strategy}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Trade Type
                        </label>
                        <select
                          value={trade.trade_type}
                          onChange={handleInputChange('trade_type')}
                          className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                          disabled={trade.isClosed}
                        >
                          <option value="">Select Type</option>
                          <option value="scalp" className="bg-gray-800">Scalp</option>
                          <option value="swing" className="bg-gray-800">Swing</option>
                          <option value="position" className="bg-gray-800">Position</option>
                          <option value="day" className="bg-gray-800">Day Trade</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Pre-Trade Emotion
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {emotionTags.map(emotion => (
                          <button
                            key={emotion}
                            type="button"
                            onClick={() => setTrade(prev => ({ 
                              ...prev, 
                              pre_emotion: prev.pre_emotion === emotion ? '' : emotion 
                            }))}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              trade.pre_emotion === emotion
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                            }`}
                            disabled={trade.isClosed}
                          >
                            {emotion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Trade Rationale
                      </label>
                      <textarea
                        value={trade.rationale}
                        onChange={handleInputChange('rationale')}
                        placeholder="Why did you take this trade? What was your analysis?"
                        rows="3"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                        disabled={trade.isClosed}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Timeframe Analysis
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={timeframeInput}
                          onChange={(e) => setTimeframeInput(e.target.value)}
                          placeholder="e.g., H1, M15, D1"
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/30 focus:outline-none"
                          disabled={trade.isClosed}
                        />
                        <NeonButton
                          type="button"
                          variant="glass"
                          size="sm"
                          onClick={addTimeframe}
                          disabled={!timeframeInput || trade.isClosed}
                          icon={Plus}
                        >
                          Add
                        </NeonButton>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trade.timeframe_analysis.map((tf, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm"
                          >
                            {tf}
                            <button
                              type="button"
                              onClick={() => removeTimeframe(tf)}
                              className="text-emerald-400 hover:text-red-400 transition-colors"
                              disabled={trade.isClosed}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={trade.tags}
                        onChange={handleInputChange('tags')}
                        placeholder="e.g., breakout, retest, news (comma separated)"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        disabled={trade.isClosed}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Post-Trade Reflection
                      </label>
                      <textarea
                        value={trade.post_reflection}
                        onChange={handleInputChange('post_reflection')}
                        placeholder="What did you learn? What would you do differently?"
                        rows="3"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                        disabled={!trade.isClosed}
                      />
                    </div>
                  </div>
                </GlassCard>

                {/* Entry & Exit Times */}
                <GlassCard title="Entry & Exit Times" icon={Clock}>
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Entry Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={trade.entry_datetime}
                          onChange={handleInputChange('entry_datetime')}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                          disabled={trade.isClosed}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Exit Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={trade.exit_datetime}
                          onChange={handleInputChange('exit_datetime')}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                          disabled={trade.isClosed}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Fees/Commission
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={trade.fees}
                          onChange={handleInputChange('fees')}
                          placeholder="0.00"
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                          disabled={trade.isClosed}
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Right Sidebar - Calculations & Validation */}
              <div className="xl:col-span-1 space-y-6">
                <GlassCard title="Trade Calculations" icon={Calculator}>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">P&L:</span>
                      <span className={`font-bold text-lg ${
                        calculations.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {calculations.pnl >= 0 ? '+' : ''}${calculations.pnl}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/70">R-Multiple:</span>
                      <span className={`font-bold ${
                        calculations.rMultiple >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {calculations.rMultiple >= 0 ? '+' : ''}{calculations.rMultiple}R
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Risk %:</span>
                      <span className={`font-bold ${
                        calculations.riskPercent > 2 ? 'text-red-400' : 
                        calculations.riskPercent > 1.5 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {calculations.riskPercent.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/70">RR Ratio:</span>
                      <span className="text-white font-bold">
                        1:{calculations.rewardRiskRatio.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Position Size:</span>
                      <span className="text-white font-bold">
                        {calculations.positionSize} units
                      </span>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard title="Risk Validation" icon={Shield}>
                  <div className="p-6 space-y-4">
                    <div className={`p-3 rounded-lg border ${
                      validation.riskStatus === 'safe' ? 'bg-emerald-500/10 border-emerald-500/30' :
                      validation.riskStatus === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                      'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {validation.riskStatus === 'safe' && <CheckCircle size={16} className="text-emerald-400" />}
                        {validation.riskStatus === 'warning' && <AlertTriangle size={16} className="text-amber-400" />}
                        {validation.riskStatus === 'danger' && <AlertTriangle size={16} className="text-red-400" />}
                        <span className={`font-semibold text-sm ${
                          validation.riskStatus === 'safe' ? 'text-emerald-400' :
                          validation.riskStatus === 'warning' ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {validation.riskStatus === 'safe' ? 'Risk Approved' :
                           validation.riskStatus === 'warning' ? 'Risk Warning' :
                           'Risk Violation'}
                        </span>
                      </div>
                    </div>

                    {Object.entries(validation.errors).map(([field, error]) => (
                      <div key={field} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-red-400 text-sm">{error}</span>
                        </div>
                      </div>
                    ))}

                    {validation.warnings.map((warning, index) => (
                      <div key={index} className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                          <span className="text-amber-400 text-sm">{warning}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Submit Button */}
                <div className="sticky bottom-0">
                  <NeonButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting || Object.keys(validation.errors).length > 0}
                    className="w-full"
                    icon={isSubmitting ? RefreshCw : CheckCircle}
                  >
                    {isSubmitting ? 'Submitting...' : editingTrade ? 'Update Trade' : 'Log Trade'}
                  </NeonButton>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TradeForm;