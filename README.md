# 🚀 TradeSync - Professional Trading Journal

> A sophisticated, full-stack trading journal application built with React, FastAPI, and modern web technologies. Track trades, analyze performance, and improve your trading with comprehensive analytics and real-time data.

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-blue.svg)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0-lightgrey.svg)](https://www.sqlite.org/)

## ✨ Features

### 📊 **Advanced Analytics Dashboard**
- Real-time P&L tracking and cumulative performance curves
- Win rate analysis with detailed breakdowns by strategy, timeframe, and instruments
- Risk metrics including maximum drawdown, Sharpe ratio, and profit factor
- Performance heatmaps by time of day and trading sessions
- R-multiple distribution analysis

### 💼 **Professional Trade Management**
- Comprehensive trade logging with entry/exit points, stop loss, and take profit
- Real-time trade P&L calculation with live price feeds
- Advanced position sizing calculator with risk management
- Trade psychology tracking (pre-trade emotions, post-trade reflection)
- Screenshot uploads with Google Drive integration
- Strategy-based trade categorization with custom checklists

### 🏦 **Multi-Account Support**
- Prop firm account management (FTMO, MyForexFunds, etc.)
- Account-specific risk limits and drawdown tracking
- Capital allocation and performance tracking per account
- Real-time balance updates and risk monitoring

### 📝 **Comprehensive Journaling**
- Daily trading journal with market analysis
- Weekly bias board with higher timeframe analysis
- Strategy management with custom rule sets
- Notes and insights tracking
- Trading calendar with session planning

### 🔄 **Real-Time Data Integration**
- Live forex price feeds via TradeMade API
- WebSocket connections for real-time updates
- Automated P&L calculations for open positions
- Market hours awareness and session tracking

### 🎨 **Modern UI/UX**
- Dark, glass-morphism design with Notion-like aesthetics
- Fully responsive design for desktop and mobile
- Interactive charts and data visualizations
- Customizable themes and layouts
- Real-time notifications and alerts

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern component-based UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful, composable charts for React
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icon library

### **Backend**
- **FastAPI** - High-performance Python web framework
- **SQLite** - Lightweight, serverless database
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - Lightning-fast ASGI server
- **Aiohttp** - Asynchronous HTTP client/server

### **Integrations**
- **TradeMade API** - Real-time forex data
- **Google Drive API** - Cloud screenshot storage
- **WebSocket** - Real-time data streaming

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0+ and npm
- **Python** 3.12+
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/tradesync.git
cd tradesync
```

### 2. Backend Setup
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Start the backend server
python main.py
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Access the Application
Open your browser and navigate to `http://localhost:5173` to start using TradeSync!

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# TradeMade API Configuration
TRADEMADE_API_KEY=your_trademade_api_key_here
TRADEMADE_API_BASE_URL=https://marketdata.tradermade.com/api/v1

# Google Drive Configuration (Optional)
GOOGLE_DRIVE_CREDENTIALS_PATH=./service-account-key.json
GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id

# Application Settings
DEBUG=True
```

### API Keys Setup

1. **TradeMade API** (for live price data):
   - Sign up at [TradeMade](https://tradermade.com)
   - Get your API key from the dashboard
   - Add it to your `.env` file

2. **Google Drive API** (for screenshot uploads):
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google Drive API
   - Create service account credentials
   - Download the JSON file and save as `service-account-key.json`

## 📖 Usage Guide

### Getting Started
1. **Create Your First Account**: Navigate to Accounts and add your trading account details
2. **Log Your First Trade**: Use the Trade Form to record trade details, psychology, and screenshots
3. **Set Up Strategies**: Define your trading strategies with custom rules and checklists
4. **Plan Your Week**: Use the Weekly Bias Board for higher timeframe analysis
5. **Review Performance**: Analyze your results in the Analytics Dashboard

### Key Workflows

#### Logging a Trade
1. Open the Trade Form from the sidebar
2. Fill in trade details (instrument, direction, entry/exit)
3. Add risk management (stop loss, take profit)
4. Record trading psychology and rationale
5. Upload screenshots for visual reference
6. Submit to save the trade

#### Weekly Planning
1. Navigate to Weekly Bias Board
2. Select the trading week
3. Add market bias and analysis
4. Set key levels (support/resistance)
5. Plan entry zones and targets
6. Save your weekly plan

#### Performance Analysis
1. Visit the Analytics Dashboard
2. Filter by timeframe, account, or strategy
3. Review key metrics and charts
4. Identify patterns and areas for improvement
5. Export reports for detailed analysis

## 📁 Project Structure

```
tradesync/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   ├── theme/           # UI theme configuration
│   │   └── assets/          # Static assets
│   ├── public/              # Public static files
│   └── package.json         # Frontend dependencies
├── backend/                 # FastAPI backend application
│   ├── config/              # Configuration files
│   ├── uploads/             # File upload storage
│   ├── main.py              # FastAPI application entry point
│   ├── models.py            # Pydantic data models
│   ├── database.py          # Database configuration
│   └── requirements.txt     # Python dependencies
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🔌 API Documentation

### Endpoints Overview

The backend provides a comprehensive REST API for all trading journal operations:

- **Trades**: CRUD operations for trade management
- **Accounts**: Multi-account support and management
- **Analytics**: Performance calculations and metrics
- **Strategies**: Trading strategy management
- **Weekly Bias**: Higher timeframe analysis
- **File Upload**: Screenshot and document management
- **Live Data**: Real-time price feeds and WebSocket connections

### Interactive API Documentation

When the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🎯 Key Features Deep Dive

### Risk Management
- **Position Sizing Calculator**: Automatically calculates optimal position sizes based on account balance and risk percentage
- **Risk Validation**: Real-time validation of trades against defined risk limits
- **Drawdown Tracking**: Monitors account drawdown and alerts when approaching limits

### Trading Psychology
- **Emotion Tracking**: Pre-trade and post-trade emotional state logging
- **Rule Adherence**: Strategy rule checklist to ensure disciplined trading
- **Reflection Journal**: Post-trade analysis and learning documentation

### Performance Analytics
- **Multi-timeframe Analysis**: Daily, weekly, monthly performance breakdowns
- **Strategy Comparison**: Performance metrics by trading strategy
- **Risk-Adjusted Returns**: Sharpe ratio, profit factor, and other risk metrics

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
python main.py              # Start development server
python -m pytest           # Run tests (when available)
uvicorn main:app --reload  # Alternative development server
```

### Building for Production

#### Frontend
```bash
cd frontend
npm run build
```

#### Backend
The backend is production-ready as-is. For deployment:
1. Set environment variables appropriately
2. Use a production ASGI server like Gunicorn with Uvicorn workers
3. Set up a reverse proxy (nginx) for serving static files

## 🤝 Contributing

We welcome contributions to TradeSync! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📋 Roadmap

### Upcoming Features
- [ ] **Mobile App**: React Native mobile application
- [ ] **Advanced Charting**: TradingView integration
- [ ] **Backtesting**: Strategy backtesting capabilities
- [ ] **Social Features**: Community trading insights
- [ ] **AI Analysis**: ML-powered trade analysis
- [ ] **More Brokers**: Integration with additional data providers
- [ ] **Portfolio Management**: Multi-asset portfolio tracking

### Known Issues
- Live price feeds require valid TradeMade API key
- Google Drive uploads require proper service account setup
- Large datasets may require pagination optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TradeMade** for providing reliable forex data APIs
- **Google** for cloud storage integration
- **React** and **FastAPI** communities for excellent documentation
- **Tailwind CSS** for the amazing utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:

1. **Check the documentation** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join our community** for discussions and help

---

**Built with ❤️ for traders, by traders**

*TradeSync - Where trading performance meets modern technology*
