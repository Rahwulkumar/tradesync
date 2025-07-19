import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# TradeMade API configuration
TRADEMADE_API_KEY = os.getenv("TRADEMADE_API_KEY")
TRADEMADE_API_BASE_URL = "https://marketdata.tradermade.com/api/v1"

# TradeMade service class
class TradeMadeService:
    def __init__(self):
        self.api_key = TRADEMADE_API_KEY
        self.base_url = TRADEMADE_API_BASE_URL
        
    async def get_live_price(self, symbol):
        """Get live price for a currency pair"""
        if not self.api_key:
            return {"success": False, "error": "API key not configured"}
            
        try:
            import aiohttp
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/live"
                params = {
                    "currency": symbol,
                    "api_key": self.api_key
                }
                
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        if "quotes" in data and len(data["quotes"]) > 0:
                            quote = data["quotes"][0]
                            return {
                                "success": True,
                                "symbol": quote["instrument"],
                                "bid": float(quote["bid"]),
                                "ask": float(quote["ask"]),
                                "mid": (float(quote["bid"]) + float(quote["ask"])) / 2,
                                "timestamp": quote["timestamp"]
                            }
                    
                    return {"success": False, "error": f"API returned status {response.status}"}
                    
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def get_live_prices(self, symbols):
        """Get live prices for multiple currency pairs"""
        results = []
        for symbol in symbols:
            result = await self.get_live_price(symbol)
            results.append(result)
        return results

    def calculate_live_pnl(self, trade_data, current_price):
        """Calculate live P&L for a trade"""
        try:
            entry_price = float(trade_data["entry_price"])
            size = float(trade_data["size"])
            fees = float(trade_data.get("fees", 0))
            direction = trade_data["direction"].lower()
            
            if direction == "long":
                pnl = (current_price - entry_price) * size - fees
            else:  # short
                pnl = (entry_price - current_price) * size - fees
                
            return round(pnl, 2)
            
        except Exception as e:
            print(f"Error calculating PnL: {e}")
            return 0

    async def get_historical_candles(self, symbol, timeframe="1H", start_time=None, end_time=None):
        """Get historical candlestick data"""
        if not self.api_key:
            return {"success": False, "error": "API key not configured"}
            
        try:
            import aiohttp
            from datetime import datetime, timedelta
            
            # Default to last 24 hours if no time specified
            if not start_time:
                start_time = (datetime.now() - timedelta(hours=24)).isoformat()
            if not end_time:
                end_time = datetime.now().isoformat()
            
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/timeseries"
                params = {
                    "currency": symbol,
                    "api_key": self.api_key,
                    "start_date": start_time.split('T')[0],
                    "end_date": end_time.split('T')[0],
                    "format": "records"
                }
                
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        # Convert to candlestick format
                        candles = []
                        if "quotes" in data:
                            for quote in data["quotes"]:
                                candles.append({
                                    "time": quote["date"],
                                    "open": float(quote["open"]),
                                    "high": float(quote["high"]),
                                    "low": float(quote["low"]),
                                    "close": float(quote["close"])
                                })
                        
                        return {
                            "success": True,
                            "symbol": symbol,
                            "candles": candles
                        }
                    
                    return {"success": False, "error": f"API returned status {response.status}"}
                    
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def close_session(self):
        """Close any open sessions"""
        pass

# Create service instance
trademade_service = TradeMadeService()


# Initialize real TradeMade service
trademade_service = TradeMadeService()