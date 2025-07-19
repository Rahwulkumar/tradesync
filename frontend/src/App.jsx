// 🚀 App.jsx - Complete TradeSync Application
// Location: App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  FileText, 
  Target, 
  Building2, 
  BookOpen,
  TrendingUp,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  User
} from 'lucide-react';

// Import all components
import Dashboard from './components/Dashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DailyJournal from './components/DailyJournal';
import Reports from './components/Reports';
import StrategyManager from './components/StrategyManager';
import AccountManager from './components/AccountManager';
import WeeklyBiasBoard from './components/WeeklyBiasBoard';
import TradeForm from './components/TradeForm';
import ErrorBoundary from './components/ErrorBoundary';

// Import styles
import './App.css';

const App = () => {
  // State management
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar hidden by default
  const [showTradeForm, setShowTradeForm] = useState(false);

  // Navigation items configuration
  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: BarChart3,
      component: Dashboard,
      description: 'Overview and performance metrics'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: TrendingUp,
      component: AnalyticsDashboard,
      description: 'Advanced performance analysis'
    },
    {
      id: 'daily-journal',
      name: 'Daily Journal',
      icon: BookOpen,
      component: DailyJournal,
      description: 'Daily trading reflection and notes'
    },
    {
      id: 'weekly-bias',
      name: 'Weekly Bias',
      icon: Target,
      component: WeeklyBiasBoard,
      description: 'Market bias and analysis'
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: FileText,
      component: Reports,
      description: 'Comprehensive trade reports'
    },
    {
      id: 'strategies',
      name: 'Strategies',
      icon: Target,
      component: StrategyManager,
      description: 'Trading strategy management'
    },
    {
      id: 'accounts',
      name: 'Accounts',
      icon: Building2,
      component: AccountManager,
      description: 'Prop firm account management'
    }
  ];

  // Event handlers
  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleViewChange = useCallback((viewId) => {
    setActiveView(viewId);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleThemeToggle = useCallback(() => {
    // Theme is always dark for our glass theme
    console.log('Theme toggle - maintaining dark theme');
  }, []);

  const handleLogoClick = useCallback(() => {
    setActiveView('dashboard');
    setIsSidebarOpen(false);
  }, []);

  const handleTradeFormOpen = useCallback(() => {
    setShowTradeForm(true);
  }, []);

  const handleTradeFormClose = useCallback(() => {
    setShowTradeForm(false);
  }, []);

  const handleTradeSubmit = useCallback(async (tradeData) => {
    try {
      console.log('Submitting trade:', tradeData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowTradeForm(false);
      alert('Trade logged successfully!');
      
    } catch (error) {
      console.error('Error submitting trade:', error);
      alert('Error logging trade. Please try again.');
    }
  }, []);

  // Theme effect - Force dark mode for glass theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('tradeSyncTheme', 'dark');
  }, []);

  // Global functions setup
  useEffect(() => {
    // Expose navigation functions globally if needed
    window.navigateToPage = handleViewChange;
    window.openTradeForm = handleTradeFormOpen;

    // Cleanup
    return () => {
      delete window.navigateToPage;
      delete window.openTradeForm;
    };
  }, [handleViewChange, handleTradeFormOpen]);

  // Handle window resize to close sidebar automatically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false); // Auto-close on desktop
      }
    };

    const handleClickOutside = (event) => {
      // Close sidebar when clicking outside on mobile
      if (isSidebarOpen && !event.target.closest('aside') && !event.target.closest('[data-sidebar-toggle]')) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Get active component
  const getActiveComponent = () => {
    const activeItem = navigationItems.find(item => item.id === activeView);
    return activeItem ? activeItem.component : Dashboard;
  };

  const ActiveComponent = getActiveComponent();
  const activeItem = navigationItems.find(item => item.id === activeView);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        
        {/* Minimal Top Header */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-black/20 backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center justify-between px-4 py-3">
            
            {/* Left - Logo and Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSidebarToggle}
                data-sidebar-toggle
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
                aria-label="Toggle menu"
              >
                <Menu size={18} />
              </button>
              
              <div 
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={handleLogoClick}
              >
                <BarChart3 size={18} className="text-white/80 group-hover:text-white transition-colors" />
                <span className="font-semibold text-white/80 group-hover:text-white transition-colors text-sm">
                  TradeSync
                </span>
              </div>

              {/* Current Page */}
              <div className="hidden md:flex items-center space-x-2 text-xs">
                <span className="text-white/40">/</span>
                <span className="text-white/70 font-medium">
                  {activeItem?.name || 'Dashboard'}
                </span>
              </div>
            </div>

            {/* Right - Quick Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleTradeFormOpen}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <TrendingUp size={14} className="mr-1.5" />
                Add Trade
              </button>
              
              <div className="w-7 h-7 bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center border border-white/10">
                <User size={14} className="text-white/70" />
              </div>
            </div>
          </div>
        </header>

        {/* Slide-out Navigation Menu */}
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={handleSidebarClose}
            />
            
            {/* Navigation Panel */}
            <nav 
              className="fixed top-0 left-0 h-full w-72 bg-black/80 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/5 rounded-lg flex items-center justify-center border border-white/20">
                    <BarChart3 size={16} className="text-white/80" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-sm">TradeSync</h2>
                    <p className="text-xs text-white/50">Trading Journal</p>
                  </div>
                </div>
                <button
                  onClick={handleSidebarClose}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="p-3 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleViewChange(item.id)}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg
                        text-left transition-all duration-200 text-sm
                        ${isActive 
                          ? 'bg-white/10 text-white border border-white/20' 
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      <Icon size={16} className={isActive ? 'text-white' : 'text-white/60'} />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Settings */}
              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
                <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200 text-sm">
                  <Settings size={16} />
                  <span className="font-medium">Settings</span>
                </button>
              </div>
            </nav>
          </>
        )}

        {/* Main Content */}
        <main className="pt-14">
          <ErrorBoundary>
            <ActiveComponent />
          </ErrorBoundary>
        </main>

        {/* Trade Form Modal */}
        {showTradeForm && (
          <TradeForm
            isOpen={showTradeForm}
            onClose={handleTradeFormClose}
            onSubmit={handleTradeSubmit}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;