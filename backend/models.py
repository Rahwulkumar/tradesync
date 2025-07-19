from pydantic import BaseModel
from typing import Optional, List

class Screenshot(BaseModel):
    label: str
    screenshot_url: str

class TradeCreate(BaseModel):
    date: str
    entry_datetime: Optional[str] = None
    exit_datetime: Optional[str] = None
    instrument: str
    direction: str
    entry_price: float
    exit_price: float
    size: float
    fees: Optional[float] = 0
    account: str
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    trade_type: Optional[str] = None
    rationale: Optional[str] = None
    tags: Optional[str] = None
    pre_emotion: Optional[str] = None
    post_reflection: Optional[str] = None
    timeframe: Optional[str] = None
    risk_amount: Optional[float] = None
    strategy_tag: Optional[str] = None
    rules_followed: Optional[List[str]] = []
    screenshots: Optional[List[Screenshot]] = []

class Trade(TradeCreate):
    id: int

class AccountCreate(BaseModel):
    account_name: str
    prop_firm: str
    capital_size: Optional[float] = 100000
    max_daily_drawdown: Optional[float] = 5
    max_overall_drawdown: Optional[float] = 10

class NoteCreate(BaseModel):
    date: str
    content: str

class Strategy(BaseModel):
    id: Optional[int] = None
    strategy_name: str
    rules: List[str]

class BiasPoint(BaseModel):
    bias_type: str
    point: str

class BiasArgument(BaseModel):
    direction: str
    reason: str

class WeeklyBiasCreate(BaseModel):
    week_start_date: str
    week_end_date: str
    pair: str
    expecting_notes: Optional[str] = None
    not_expecting_notes: Optional[str] = None
    bias_points: Optional[List[BiasPoint]] = []
    arguments: Optional[List[BiasArgument]] = []
    screenshots: Optional[List[Screenshot]] = []