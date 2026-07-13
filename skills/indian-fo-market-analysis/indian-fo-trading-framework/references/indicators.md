# Indicators Reference — Indian F&O

How to use: pick **one indicator per role** (trend, momentum, volatility,
volume, options-flow) — stacking three momentum oscillators is one signal
counted three times, not three signals. Always state the setting used.

## 1. Trend

| Indicator | Common setting | Signal |
| --- | --- | --- |
| EMA | 9/21 (intraday), 20/50/100/200 (positional) | Price above rising EMA = uptrend; 9>21 crossover for intraday momentum; 20/50 golden-death cross positional |
| Supertrend | (10, 3) — very popular for NIFTY/BANKNIFTY intraday | Flip green/red = trend change; acts as trailing SL |
| ADX/DMI | 14 | ADX > 25 = trending (breakout tactics valid); ADX < 20 = chop (fade edges, sell premium); +DI/−DI cross for direction |
| Ichimoku | 9/26/52 | Price vs cloud for bias; TK cross for entry; cloud twist ahead = regime change |
| Parabolic SAR | 0.02/0.2 | Trailing stop in strong trends only — whipsaws in range |

## 2. Momentum

| Indicator | Setting | Signal |
| --- | --- | --- |
| RSI | 14 | >60 zone = bullish regime, <40 = bearish (regime read beats overbought/oversold in trends); 70/30 extremes for range fades; **divergence** (price HH, RSI LH) is the strongest use |
| MACD | 12/26/9 | Signal-line cross + histogram flip; zero-line cross = trend confirmation; divergence at extremes |
| Stochastic | 14/3/3 or 5/3/3 | %K/%D cross from <20 / >80 in ranges; useless in strong trends |
| CCI | 20 | ±100 breakout momentum |
| ROC / Momentum | 10–14 | Thrust confirmation on breakouts |

## 3. Volatility

| Indicator | Setting | Signal |
| --- | --- | --- |
| Bollinger Bands | 20, 2σ | **Squeeze** (band width at multi-day low) precedes expansion — pair with OI for direction; band walk = strong trend, don't fade; mean reversion to 20-SMA in ranges |
| ATR | 14 | SL distance (1–1.5× ATR) and target sizing; rising ATR = expansion regime |
| Keltner Channels | 20, 1.5× ATR | BB-inside-KC = TTM squeeze variant |
| India VIX | — | <12 cheap premium (buy options / avoid selling), 12–17 normal, >20 elevated (sell defined-risk premium, wider SLs), spikes >25 = event/panic regime |
| IV / IV Percentile (per contract) | — | Buy options when IV percentile low, sell spreads when high; **IV crush** after events kills long options even when direction is right |

## 4. Volume & Flow

| Indicator | Signal |
| --- | --- |
| VWAP | Intraday institutional benchmark — above VWAP = long bias, below = short bias; flat-VWAP chop = no-trade; anchored VWAP from swing points/events for positional levels |
| Volume + OI (futures) | Price↑ Vol↑ OI↑ = strongest continuation; price↑ on falling volume = suspect move |
| OBV | Divergence vs price = accumulation/distribution warning |
| Volume Profile | POC (point of control), VAH/VAL — value-area edges act as S/R; naked POCs get revisited |
| Delivery % (stocks) | Rising delivery + price up = genuine accumulation (positional stock F&O) |

## 5. Pivots & Reference Levels

| Tool | Use |
| --- | --- |
| CPR (Central Pivot Range) | Narrow CPR → trending day likely (trade breakouts); wide CPR → rangebound day (fade edges); virgin CPR = magnet level |
| Floor pivots (P, R1–R3, S1–S3) | Intraday targets/reversal zones; confluence with OI strikes is high-value |
| Previous Day High/Low/Close | The most-watched intraday levels in index trading |
| Opening Range (first 15/30 min) | ORB reference — see tactics file |

## 6. Options-Specific Identifiers (chain reads)

| Identifier | Read |
| --- | --- |
| Highest Call OI strike | Resistance / expected upper bound; shift upward = bullish repositioning |
| Highest Put OI strike | Support / expected lower bound |
| OI change (intraday) | Fresh call writing at a strike = active resistance; call **unwinding** = resistance breaking (bullish) |
| PCR (OI) | ~<0.7 oversold/bearish extreme (contrarian bullish), ~>1.3 overbought (contrarian bearish); trend of PCR matters more than level |
| Max Pain | Expiry gravitation level — relevant mainly on expiry day, weak signal earlier |
| ATM straddle premium | Expected move until expiry ≈ straddle price; premium collapsing intraday = rangebound conviction, exploding = breakout underway |
| IV skew (calls vs puts) | Put IV ≫ call IV = downside fear/hedging demand |
| Futures basis | Premium widening = longs adding; slipping to discount = hedging/shorts |
| FII/DII derivatives data (EOD) | FII index-futures long/short ratio for next-day positional bias |

## 7. Greeks Quick Reference (for strategy selection)

- **Delta:** directional exposure; ATM ≈ 0.5. Buy 0.4–0.6 delta for momentum; far-OTM lottery buys are guardrail violations disguised as trades.
- **Theta:** decay accelerates in the last week and intraday after ~14:00 on expiry day; long options must produce price action *before* theta bleed — this is the exit trigger in the buying rules.
- **Gamma:** highest ATM near expiry — expiry-day moves are fast and binary both ways.
- **Vega:** long options lose on VIX/IV drops even when direction is right; check IV before buying, not just the chart.
