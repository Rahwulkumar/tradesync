import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Compass,
  FileText,
  Camera,
  ChevronLeft,
  ChevronRight,
  Star,
  Bookmark,
  Save,
  X,
  Upload
} from 'lucide-react';
import GlassCard from './ui/GlassCard';
import NeonButton from './ui/NeonButton';
import GlassInput from './ui/GlassInput';

const WeeklyBiasBoard = () => {
  const [biasScreenshots, setBiasScreenshots] = useState([]);
  const [uploadingBiasScreenshots, setUploadingBiasScreenshots] = useState(false);

  const [selectedWeek, setSelectedWeek] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    return startOfWeek.toISOString().split('T')[0];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBias, setEditingBias] = useState(null);
  const [weeklyBiases, setWeeklyBiases] = useState([]);

  // Load weekly biases from localStorage on mount
  useEffect(() => {
    loadWeeklyBiases();
  }, []);

  // Reload biases when week changes
  useEffect(() => {
    loadWeeklyBiases();
  }, [selectedWeek]);

  const loadWeeklyBiases = () => {
    try {
      const savedBiases = JSON.parse(localStorage.getItem('tradesync_weekly_biases') || '[]');
      console.log('Loaded weekly biases:', savedBiases.length);
      setWeeklyBiases(savedBiases);
    } catch (error) {
      console.error('Error loading weekly biases:', error);
      setWeeklyBiases([]);
    }
  };

  const [newBias, setNewBias] = useState({
    pair: '',
    overall_bias: 'bullish',
    confidence: 50,
    expecting_scenarios: [''],
    not_expecting_scenarios: [''],
    fundamental_drivers: [''],
    key_levels: {
      resistance: [''],
      support: ['']
    },
    technical_analysis: {
      higher_timeframe: '',
      daily_bias: '',
      session_plan: ''
    },
    trade_plan: {
      entry_zones: [''],
      targets: [''],
      invalidation: ''
    }
  });

  const majorPairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
    'EURJPY', 'GBPJPY', 'EURGBP', 'AUDJPY', 'EURAUD', 'GBPAUD', 'GBPCAD'
  ];

  // Get current week's start and end dates
  const getWeekDates = (weekStart) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 4); // Friday
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  // Navigate weeks
  const navigateWeek = (direction) => {
    const current = new Date(selectedWeek);
    current.setDate(current.getDate() + (direction * 7));
    setSelectedWeek(current.toISOString().split('T')[0]);
  };

  // Get week's bias data
  const getCurrentWeekBiases = () => {
    const { start, end } = getWeekDates(selectedWeek);
    return weeklyBiases.filter(bias => 
      bias.week_start_date === start || 
      (bias.week_start_date <= start && bias.week_end_date >= start)
    );
  };

  // Add array item helpers
  const addArrayItem = (field, subfield = null) => {
    setNewBias(prev => {
      if (subfield) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [subfield]: [...prev[field][subfield], '']
          }
        };
      } else {
        return {
          ...prev,
          [field]: [...prev[field], '']
        };
      }
    });
  };

  const updateArrayItem = (field, index, value, subfield = null) => {
    setNewBias(prev => {
      if (subfield) {
        const newArray = [...prev[field][subfield]];
        newArray[index] = value;
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [subfield]: newArray
          }
        };
      } else {
        const newArray = [...prev[field]];
        newArray[index] = value;
        return {
          ...prev,
          [field]: newArray
        };
      }
    });
  };

  const removeArrayItem = (field, index, subfield = null) => {
    setNewBias(prev => {
      if (subfield) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [subfield]: prev[field][subfield].filter((_, i) => i !== index)
          }
        };
      } else {
        return {
          ...prev,
          [field]: prev[field].filter((_, i) => i !== index)
        };
      }
    });
  };

  // Handle screenshot uploads
  const handleBiasScreenshotUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    setUploadingBiasScreenshots(true);
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('screenshots', file);
    });

    try {
      const response = await fetch('http://localhost:8000/upload-screenshots/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const uploadedFiles = await response.json();
        setBiasScreenshots(prev => [
          ...prev,
          ...uploadedFiles.files.map(file => ({
            filename: file.filename,
            originalName: file.originalName,
            uploadedAt: new Date().toISOString()
          }))
        ]);
      } else {
        console.error('Upload failed');
        alert('Failed to upload screenshots. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading screenshots. Please try again.');
    } finally {
      setUploadingBiasScreenshots(false);
    }
  };

  // Remove screenshot
  const removeBiasScreenshot = (index) => {
    setBiasScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  // Save bias
  const saveBias = async () => {
    // Validate required fields
    if (!newBias.pair) {
      alert('Please select a currency pair');
      return;
    }

    const { start, end } = getWeekDates(selectedWeek);
    
    const bias = {
      id: editingBias ? editingBias.id : `bias_${Date.now()}`,
      week_start_date: start,
      week_end_date: end,
      pair: newBias.pair,
      overall_bias: newBias.overall_bias,
      confidence: newBias.confidence,
      expecting_scenarios: newBias.expecting_scenarios.filter(s => s.trim()),
      not_expecting_scenarios: newBias.not_expecting_scenarios.filter(s => s.trim()),
      fundamental_drivers: newBias.fundamental_drivers.filter(d => d.trim()),
      key_levels: {
        resistance: newBias.key_levels.resistance.filter(l => l.trim()),
        support: newBias.key_levels.support.filter(l => l.trim())
      },
      trade_plan: {
        entry_zones: newBias.trade_plan.entry_zones.filter(z => z.trim()),
        targets: newBias.trade_plan.targets.filter(t => t.trim()),
        invalidation: newBias.trade_plan.invalidation
      },
      technical_analysis: {
        higher_timeframe: newBias.technical_analysis.higher_timeframe,
        daily_bias: newBias.technical_analysis.daily_bias,
        session_plan: newBias.technical_analysis.session_plan
      },
      screenshots: biasScreenshots.map(s => ({
        url: s.url,
        label: s.label || 'Market Analysis',
        uploadedAt: s.uploadedAt
      })),
      actual_outcome: editingBias ? editingBias.actual_outcome : null,
      created_date: editingBias ? editingBias.created_date : new Date().toISOString().split('T')[0],
      status: 'active'
    };

    // Save to localStorage
    try {
      let existingBiases = [];
      try {
        existingBiases = JSON.parse(localStorage.getItem('tradesync_weekly_biases') || '[]');
      } catch (e) {
        console.warn('Could not parse existing biases, starting fresh');
        existingBiases = [];
      }
      
      if (editingBias) {
        // Update existing bias
        const index = existingBiases.findIndex(b => b.id === editingBias.id);
        if (index !== -1) {
          existingBiases[index] = bias;
        } else {
          existingBiases.unshift(bias);
        }
        setWeeklyBiases(prev => prev.map(b => b.id === editingBias.id ? bias : b));
      } else {
        // Add new bias
        existingBiases.unshift(bias);
        setWeeklyBiases(prev => [bias, ...prev]);
      }
      
      localStorage.setItem('tradesync_weekly_biases', JSON.stringify(existingBiases));
      
      console.log('Weekly bias saved successfully:', bias);
      alert(editingBias ? 'Weekly bias updated successfully!' : 'Weekly bias saved successfully!');
      
      resetForm();
      
    } catch (error) {
      console.error('Error saving weekly bias:', error);
      alert('Error saving weekly bias. Please try again.');
    }
  };

  const resetForm = () => {
    setNewBias({
      pair: '',
      overall_bias: 'bullish',
      confidence: 50,
      expecting_scenarios: [''],
      not_expecting_scenarios: [''],
      fundamental_drivers: [''],
      key_levels: { resistance: [''], support: [''] },
      technical_analysis: { higher_timeframe: '', daily_bias: '', session_plan: '' },
      trade_plan: { entry_zones: [''], targets: [''], invalidation: '' }
    });
    setBiasScreenshots([]);
    setShowAddForm(false);
    setEditingBias(null);
  };

  const editBias = (bias) => {
    setEditingBias(bias);
    setNewBias({
      pair: bias.pair,
      overall_bias: bias.overall_bias,
      confidence: bias.confidence,
      expecting_scenarios: bias.expecting_scenarios?.length ? [...bias.expecting_scenarios] : [''],
      not_expecting_scenarios: bias.not_expecting_scenarios?.length ? [...bias.not_expecting_scenarios] : [''],
      fundamental_drivers: bias.fundamental_drivers?.length ? [...bias.fundamental_drivers] : [''],
      key_levels: {
        resistance: bias.key_levels?.resistance?.length ? [...bias.key_levels.resistance] : [''],
        support: bias.key_levels?.support?.length ? [...bias.key_levels.support] : ['']
      },
      technical_analysis: { 
        higher_timeframe: bias.technical_analysis?.higher_timeframe || '',
        daily_bias: bias.technical_analysis?.daily_bias || '',
        session_plan: bias.technical_analysis?.session_plan || ''
      },
      trade_plan: {
        entry_zones: bias.trade_plan?.entry_zones?.length ? [...bias.trade_plan.entry_zones] : [''],
        targets: bias.trade_plan?.targets?.length ? [...bias.trade_plan.targets] : [''],
        invalidation: bias.trade_plan?.invalidation || ''
      }
    });
    setBiasScreenshots(bias.screenshots || []);
    setShowAddForm(true);
  };

  const deleteBias = (biasId) => {
    if (window.confirm('Are you sure you want to delete this bias?')) {
      try {
        const existingBiases = JSON.parse(localStorage.getItem('tradesync_weekly_biases') || '[]');
        const updatedBiases = existingBiases.filter(b => b.id !== biasId);
        localStorage.setItem('tradesync_weekly_biases', JSON.stringify(updatedBiases));
        setWeeklyBiases(prev => prev.filter(b => b.id !== biasId));
        console.log('Bias deleted successfully');
      } catch (error) {
        console.error('Error deleting bias:', error);
        alert('Error deleting bias');
      }
    }
  };

  const getBiasColor = (bias) => {
    return bias === 'bullish' ? 'text-profit-600 dark:text-profit-400' : 'text-loss-600 dark:text-loss-400';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-profit-600 dark:text-profit-400';
    if (confidence >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-loss-600 dark:text-loss-400';
  };

  const currentWeekBiases = getCurrentWeekBiases();
  const { start: weekStart, end: weekEnd } = getWeekDates(selectedWeek);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
              Weekly Bias Board
            </h1>
            <p className="text-white/60">
              Professional market analysis and weekly bias tracking
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <NeonButton 
              variant="glass" 
              size="md"
              onClick={() => {
                setShowAddForm(true);
                setEditingBias(null);
                setNewBias({
                  pair: '',
                  overall_bias: 'bullish',
                  confidence: 50,
                  expecting_scenarios: [''],
                  not_expecting_scenarios: [''],
                  fundamental_drivers: [''],
                  key_levels: { resistance: [''], support: [''] },
                  technical_analysis: { higher_timeframe: '', daily_bias: '', session_plan: '' },
                  trade_plan: { entry_zones: [''], targets: [''], invalidation: '' }
                });
                setBiasScreenshots([]);
              }}
              className="text-white/70 hover:text-white border-white/20 hover:border-white/40 px-6 py-3 min-w-[140px]"
            >
              <Plus size={16} className="mr-3" />
              Add Bias
            </NeonButton>
          </div>
        </div>

        {/* Week Navigation */}
        <GlassCard variant="medium" hoverable={false}>
          <div className="p-6">
            <div className="flex items-center justify-between gap-6">
              <NeonButton
                variant="glass"
                size="md"
                onClick={() => navigateWeek(-1)}
                className="text-white/70 hover:text-white border-white/20 hover:border-white/40 px-6 py-3 min-w-[160px]"
              >
                <ChevronLeft size={16} className="mr-3" />
                Previous Week
              </NeonButton>
              
              <div className="text-center flex-1">
                <h2 className="text-xl font-bold text-white">
                  Week of {new Date(weekStart).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric' 
                  })} - {new Date(weekEnd).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </h2>
                <p className="text-sm text-white/60 mt-1">
                  {currentWeekBiases.length} bias{currentWeekBiases.length !== 1 ? 'es' : ''} tracked
                </p>
              </div>
              
              <NeonButton
                variant="glass"
                size="md"
                onClick={() => navigateWeek(1)}
                className="text-white/70 hover:text-white border-white/20 hover:border-white/40 px-6 py-3 min-w-[160px]"
              >
                Next Week
                <ChevronRight size={16} className="ml-3" />
              </NeonButton>
            </div>
          </div>
        </GlassCard>

        {/* Bias Cards */}
        {currentWeekBiases.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-6 border-b border-white/5">
            {currentWeekBiases.map((bias) => (
              <GlassCard 
                key={bias.id}
                variant="medium" 
                hoverable={true}
              >
                <div className="p-6 border-l-2 border-white/5">
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
                    <div>
                      <h3 className="text-lg font-bold text-white">{bias.pair} Weekly Bias</h3>
                      <p className="text-white/60 text-sm">
                        {bias.overall_bias.toUpperCase()} • {bias.confidence}% confidence
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        bias.status === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {bias.status === 'completed' ? 'Completed' : 'Active'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                  
                  {/* Bias Overview */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-full ${
                        bias.overall_bias === 'bullish' 
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {bias.overall_bias === 'bullish' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      </div>
                      <div>
                        <div className={`font-bold text-lg ${
                          bias.overall_bias === 'bullish' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {bias.overall_bias.toUpperCase()}
                        </div>
                        <div className="text-sm text-white/60">
                          Market Direction
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        bias.confidence >= 80 ? 'text-emerald-400' :
                        bias.confidence >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {bias.confidence}%
                      </div>
                      <div className="text-sm text-white/60">
                        Confidence
                      </div>
                    </div>
                  </div>

                  {/* Key Levels */}
                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                        <Target size={14} className="inline mr-1 text-red-400" />
                        Resistance
                      </h4>
                      <div className="space-y-1">
                        {(bias.key_levels?.resistance || []).slice(0, 3).map((level, index) => (
                          <div key={index} className="text-sm text-red-400 font-mono bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                            {level}
                          </div>
                        ))}
                        {(!bias.key_levels?.resistance || bias.key_levels.resistance.length === 0) && (
                          <div className="text-xs text-white/40">No levels set</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                        <Target size={14} className="inline mr-1 text-emerald-400" />
                        Support
                      </h4>
                      <div className="space-y-1">
                        {(bias.key_levels?.support || []).slice(0, 3).map((level, index) => (
                          <div key={index} className="text-sm text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                            {level}
                          </div>
                        ))}
                        {(!bias.key_levels?.support || bias.key_levels.support.length === 0) && (
                          <div className="text-xs text-white/40">No levels set</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Scenarios Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                      <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                        <CheckCircle size={14} className="inline mr-1 text-emerald-400" />
                        Expecting
                      </h4>
                      <ul className="space-y-1">
                        {(bias.expecting_scenarios || []).slice(0, 2).map((scenario, index) => (
                          <li key={index} className="text-sm text-white/70 flex items-start">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {scenario}
                          </li>
                        ))}
                        {(!bias.expecting_scenarios || bias.expecting_scenarios.length === 0) && (
                          <li className="text-xs text-white/40">No scenarios set</li>
                        )}
                      </ul>
                    </div>

                    <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                      <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                        <AlertTriangle size={14} className="inline mr-1 text-red-400" />
                        Not Expecting
                      </h4>
                      <ul className="space-y-1">
                        {(bias.not_expecting_scenarios || []).slice(0, 2).map((scenario, index) => (
                          <li key={index} className="text-sm text-white/70 flex items-start">
                            <span className="w-1 h-1 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {scenario}
                          </li>
                        ))}
                        {(!bias.not_expecting_scenarios || bias.not_expecting_scenarios.length === 0) && (
                          <li className="text-xs text-white/40">No scenarios set</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <NeonButton
                        variant="glass"
                        size="sm"
                        onClick={() => editBias(bias)}
                        className="px-4 py-2 min-w-[80px]"
                      >
                        <Edit size={14} className="mr-2" />
                        Edit
                      </NeonButton>
                      
                      <NeonButton
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteBias(bias.id)}
                        className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                      </NeonButton>
                    </div>

                    <NeonButton
                      variant="secondary"
                      size="sm"
                      className="px-4 py-2 min-w-[120px]"
                    >
                      <Eye size={14} className="mr-2" />
                      View Details
                    </NeonButton>
                  </div>
                </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard className="mb-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <Compass size={32} className="text-white/60" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No Weekly Bias Set
              </h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Create your first weekly bias analysis for this week and start tracking your market outlook
              </p>
              <NeonButton
                variant="primary"
                size="md"
                onClick={() => {
                  setShowAddForm(true);
                  setEditingBias(null);
                  setNewBias({
                    pair: '',
                    overall_bias: 'bullish',
                    confidence: 50,
                    expecting_scenarios: [''],
                    not_expecting_scenarios: [''],
                    fundamental_drivers: [''],
                    key_levels: { resistance: [''], support: [''] },
                    technical_analysis: { higher_timeframe: '', daily_bias: '', session_plan: '' },
                    trade_plan: { entry_zones: [''], targets: [''], invalidation: '' }
                  });
                  setBiasScreenshots([]);
                }}
                className="px-8 py-3 min-w-[180px]"
              >
                <Plus size={16} className="mr-2" />
                Add Weekly Bias
              </NeonButton>
            </div>
          </GlassCard>
        )}

        {/* Add/Edit Bias Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20">
              
              {/* Modal Header */}
              <div className="sticky top-0 bg-black/60 backdrop-blur-xl border-b border-white/10 p-6 z-10 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {editingBias ? 'Edit Weekly Bias' : 'Add Weekly Bias'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Currency Pair *
                    </label>
                    <select
                      value={newBias.pair}
                      onChange={(e) => setNewBias(prev => ({ ...prev, pair: e.target.value }))}
                      className="w-full h-10 px-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all text-white backdrop-blur-sm"
                      required
                    >
                      <option value="">Select Pair</option>
                      {majorPairs.map(pair => (
                        <option key={pair} value={pair} className="bg-black text-white">{pair}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Overall Bias *
                    </label>
                    <select
                      value={newBias.overall_bias}
                      onChange={(e) => setNewBias(prev => ({ ...prev, overall_bias: e.target.value }))}
                      className="w-full h-10 px-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all text-white backdrop-blur-sm"
                    >
                      <option value="bullish" className="bg-black text-white">Bullish</option>
                      <option value="bearish" className="bg-black text-white">Bearish</option>
                      <option value="neutral" className="bg-black text-white">Neutral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Confidence Level: <span className={`font-bold ${
                        newBias.confidence >= 80 ? 'text-emerald-400' :
                        newBias.confidence >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>{newBias.confidence}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newBias.confidence}
                      onChange={(e) => setNewBias(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700 slider"
                      style={{
                        background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #22c55e 100%)`
                      }}
                    />
                  </div>
                </div>

                {/* Expecting/Not Expecting Scenarios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Expecting Scenarios
                    </label>
                    <div className="flex flex-col space-y-2">
                      {(newBias.expecting_scenarios || []).map((scenario, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={scenario}
                            onChange={(e) => updateArrayItem('expecting_scenarios', index, e.target.value)}
                            className="flex-1 h-10 px-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all text-white backdrop-blur-sm placeholder-white/50"
                            placeholder="Enter expecting scenario"
                          />
                          <NeonButton
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem('expecting_scenarios', index)}
                            className="px-2 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 min-w-[36px]"
                          >
                            <Trash2 size={14} />
                          </NeonButton>
                        </div>
                      ))}
                      <NeonButton
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem('expecting_scenarios')}
                        className="w-full px-3 py-2 text-sm"
                      >
                        <Plus size={12} className="mr-1" />
                        Add Scenario
                      </NeonButton>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Not Expecting Scenarios
                    </label>
                    <div className="flex flex-col space-y-2">
                      {(newBias.not_expecting_scenarios || []).map((scenario, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={scenario}
                            onChange={(e) => updateArrayItem('not_expecting_scenarios', index, e.target.value)}
                            className="flex-1 h-10 px-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all text-white backdrop-blur-sm placeholder-white/50"
                            placeholder="Enter not expecting scenario"
                          />
                          <NeonButton
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem('not_expecting_scenarios', index)}
                            className="px-2 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 min-w-[36px]"
                          >
                            <Trash2 size={14} />
                          </NeonButton>
                        </div>
                      ))}
                      <NeonButton
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem('not_expecting_scenarios')}
                        className="w-full px-3 py-2 text-sm"
                      >
                        <Plus size={12} className="mr-1" />
                        Add Scenario
                      </NeonButton>
                    </div>
                  </div>
                </div>

                {/* Key Levels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Key Resistance Levels
                    </label>
                    <div className="flex flex-col space-y-2">
                      {(newBias.key_levels.resistance || []).map((level, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={level}
                            onChange={(e) => updateArrayItem('key_levels', index, e.target.value, 'resistance')}
                            className="flex-1 h-10 px-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all text-white backdrop-blur-sm placeholder-white/50"
                            placeholder="Enter resistance level"
                          />
                          <NeonButton
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem('key_levels', index, 'resistance')}
                            className="px-2 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 min-w-[36px]"
                          >
                            <Trash2 size={14} />
                          </NeonButton>
                        </div>
                      ))}
                      <NeonButton
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem('key_levels', 'resistance')}
                        className="w-full px-3 py-2 text-sm"
                      >
                        <Plus size={12} className="mr-1" />
                        Add Resistance
                      </NeonButton>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Key Support Levels
                    </label>
                    <div className="flex flex-col space-y-2">
                      {(newBias.key_levels.support || []).map((level, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={level}
                            onChange={(e) => updateArrayItem('key_levels', index, e.target.value, 'support')}
                            className="flex-1 h-10 px-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all text-white backdrop-blur-sm placeholder-white/50"
                            placeholder="Enter support level"
                          />
                          <NeonButton
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem('key_levels', index, 'support')}
                            className="px-2 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 min-w-[36px]"
                          >
                            <Trash2 size={14} />
                          </NeonButton>
                        </div>
                      ))}
                      <NeonButton
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem('key_levels', 'support')}
                        className="w-full px-3 py-2 text-sm"
                      >
                        <Plus size={12} className="mr-1" />
                        Add Support
                      </NeonButton>
                    </div>
                  </div>
                </div>

                {/* Technical Analysis */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Technical Analysis
                  </label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Higher Timeframe Analysis
                        </label>
                        <textarea
                          value={newBias.technical_analysis.higher_timeframe}
                          onChange={(e) => setNewBias(prev => ({ 
                            ...prev, 
                            technical_analysis: { 
                              ...prev.technical_analysis, 
                              higher_timeframe: e.target.value 
                            } 
                          }))}
                          className="w-full h-24 px-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all resize-none text-white backdrop-blur-sm placeholder-white/50"
                          placeholder="Enter your analysis for the higher timeframe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Daily Bias
                        </label>
                        <select
                          value={newBias.technical_analysis.daily_bias}
                          onChange={(e) => setNewBias(prev => ({ 
                            ...prev, 
                            technical_analysis: { 
                              ...prev.technical_analysis, 
                              daily_bias: e.target.value 
                            } 
                          }))}
                          className="w-full h-10 px-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all text-white backdrop-blur-sm"
                        >
                          <option value="">Select Daily Bias</option>
                          <option value="bullish">Bullish</option>
                          <option value="bearish">Bearish</option>
                          <option value="neutral">Neutral</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Session Plan
                      </label>
                      <textarea
                        value={newBias.technical_analysis.session_plan}
                        onChange={(e) => setNewBias(prev => ({ 
                          ...prev, 
                          technical_analysis: { 
                            ...prev.technical_analysis, 
                            session_plan: e.target.value 
                          } 
                        }))}
                        className="w-full h-24 px-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all resize-none text-white backdrop-blur-sm placeholder-white/50"
                        placeholder="Enter your session plan"
                      />
                    </div>
                  </div>
                </div>

                {/* Trade Plan */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Trade Plan
                  </label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Entry Zones
                        </label>
                        <div className="flex flex-col space-y-2">
                          {(newBias.trade_plan.entry_zones || []).map((zone, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={zone}
                                onChange={(e) => updateArrayItem('trade_plan', index, e.target.value, 'entry_zones')}
                                className="flex-1 h-10 px-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all text-white backdrop-blur-sm placeholder-white/50"
                                placeholder="Enter entry zone"
                              />
                              <NeonButton
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArrayItem('trade_plan', index, 'entry_zones')}
                                className="px-2 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 min-w-[36px]"
                              >
                                <Trash2 size={14} />
                              </NeonButton>
                            </div>
                          ))}
                          <NeonButton
                            variant="outline"
                            size="sm"
                            onClick={() => addArrayItem('trade_plan', 'entry_zones')}
                            className="w-full px-3 py-2 text-sm"
                          >
                            <Plus size={12} className="mr-1" />
                            Add Entry Zone
                          </NeonButton>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Targets
                        </label>
                        <div className="flex flex-col space-y-2">
                          {(newBias.trade_plan.targets || []).map((target, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={target}
                                onChange={(e) => updateArrayItem('trade_plan', index, e.target.value, 'targets')}
                                className="flex-1 h-10 px-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all text-white backdrop-blur-sm placeholder-white/50"
                                placeholder="Enter target"
                              />
                              <NeonButton
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArrayItem('trade_plan', index, 'targets')}
                                className="px-2 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 min-w-[36px]"
                              >
                                <Trash2 size={14} />
                              </NeonButton>
                            </div>
                          ))}
                          <NeonButton
                            variant="outline"
                            size="sm"
                            onClick={() => addArrayItem('trade_plan', 'targets')}
                            className="w-full px-3 py-2 text-sm"
                          >
                            <Plus size={12} className="mr-1" />
                            Add Target
                          </NeonButton>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Invalidation
                      </label>
                      <input
                        type="text"
                        value={newBias.trade_plan.invalidation}
                        onChange={(e) => setNewBias(prev => ({ 
                          ...prev, 
                          trade_plan: { 
                            ...prev.trade_plan, 
                            invalidation: e.target.value 
                          } 
                        }))}
                        className="w-full h-10 px-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all text-white backdrop-blur-sm placeholder-white/50"
                        placeholder="Enter invalidation criteria"
                      />
                    </div>
                  </div>
                </div>

                {/* Screenshots Section */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Screenshots & Analysis Images
                  </label>
                  
                  {/* Upload Area */}
                  <div className="relative">
                    <input
                      type="file"
                      id="biasScreenshots"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleBiasScreenshotUpload(e.target.files)}
                      className="hidden"
                    />
                    <label
                      htmlFor="biasScreenshots"
                      className={`
                        flex flex-col items-center justify-center w-full h-32 
                        border-2 border-dashed border-white/30 rounded-lg 
                        hover:border-white/50 transition-colors cursor-pointer
                        bg-white/5 hover:bg-white/10
                        ${uploadingBiasScreenshots ? 'opacity-50 cursor-wait' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-white/60" />
                        <p className="text-sm text-white/70 mb-1">
                          <span className="font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-white/50">PNG, JPG, JPEG files (Max 10MB each)</p>
                      </div>
                    </label>
                  </div>

                  {/* Uploaded Screenshots */}
                  {biasScreenshots.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-medium text-white/80">Uploaded Screenshots</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {biasScreenshots.map((screenshot, index) => (
                          <div key={index} className="relative group bg-white/10 rounded-lg p-3 border border-white/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 min-w-0">
                                <div className="flex-shrink-0">
                                  <FileText className="w-5 h-5 text-white/60" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm text-white font-medium truncate">
                                    {screenshot.originalName || screenshot.filename}
                                  </p>
                                  <p className="text-xs text-white/50">
                                    {screenshot.uploadedAt ? new Date(screenshot.uploadedAt).toLocaleDateString() : 'Just uploaded'}
                                  </p>
                                </div>
                              </div>
                              <NeonButton
                                variant="ghost"
                                size="sm"
                                onClick={() => removeBiasScreenshot(index)}
                                className="px-2 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 min-w-[36px] opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={14} />
                              </NeonButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-6 border-t border-white/10">
                  <NeonButton
                    variant="primary"
                    size="md"
                    onClick={saveBias}
                    disabled={!newBias.pair}
                    className="px-8 py-3 min-w-[140px]"
                  >
                    <Save size={16} className="mr-2" />
                    {editingBias ? 'Update Bias' : 'Save Bias'}
                  </NeonButton>
                  
                  <NeonButton
                    variant="ghost"
                    size="md"
                    onClick={resetForm}
                    className="px-6 py-3 min-w-[100px]"
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </NeonButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyBiasBoard;