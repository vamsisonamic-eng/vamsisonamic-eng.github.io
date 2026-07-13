# Tactics Playbook — Indian F&O

Every tactic below is subject to the Part 2 guardrails: SL defined before
entry, size from SL distance, ≤1–2% risk, no averaging down, short premium
only as defined-risk structures. A tactic is only callable when its listed
conditions are actually present — name them when recommending it.

## 1. Intraday Index Tactics

### Opening Range Breakout (ORB)
- Mark first 15-min (or 30-min) high/low after 09:15.
- **Long** on close above ORH, **short** below ORL; SL = other side of range or mid-range.
- Best on gap days aligned with global cues and a narrow CPR; skip when the opening range is huge (SL too wide → sizing fails).

### VWAP Strategies
- **Trend day:** price holds one side of rising/falling VWAP — enter on pullbacks *to* VWAP with rejection candles, SL beyond VWAP.
- **Mean reversion:** extended >1.5–2× ATR from flat VWAP in a range regime → fade back to VWAP with defined-risk options.
- **VWAP reclaim:** loss then reclaim of VWAP with volume = failed-breakdown long.

### CPR / Pivot Day-Typing
- **Narrow CPR + price opens away from it:** trending day — run breakout/pullback tactics, trail with Supertrend(10,3).
- **Wide CPR / open inside CPR:** rangebound — fade R1/S1 with reversal candles or deploy intraday defined-risk premium selling.

### Breakout–Retest
- Level break (PDH/PDL, range edge, pattern neckline) with volume + OI confirmation → enter on successful retest; SL below the retest swing. Avoids the fakeout that plain breakout entries eat.

### Liquidity Sweep Reversal (stop-hunt fade)
- Sweep of an obvious level (equal highs/lows, PDH/PDL) with a sharp rejection wick, then CHoCH on lower timeframe → counter-trend entry, SL beyond the sweep extreme. High R:R; needs fast, disciplined execution.

### Trap Fades
- Confirmed bull/bear trap (breakout candle closes back inside range) → trade the opposite direction targeting the range's other side.

## 2. OI-Driven Tactics

- **OI crossover:** call-OI wall being eaten (call unwinding + price pushing the strike) → momentum long into the next wall; mirror for puts.
- **Support/resistance from walls:** buy dips into the max-put-OI strike with reversal candles; fade rallies into max-call-OI with defined risk — only in non-trending regimes.
- **Buildup alignment:** take longs only when futures show Long Buildup / Short Covering; shorts only on Short Buildup / Long Unwinding. Price signal against OI signal = stand aside.
- **Straddle-premium monitor:** ATM straddle falling all day = writers in control (range tactics valid); straddle suddenly expanding = breakout in progress (kill premium-selling positions, switch to momentum).

## 3. Expiry-Day Tactics (index, cash-settled)

- **Morning:** direction is decided by which OI wall breaks first; ORB + OI unwinding is the cleanest read.
- **Afternoon theta crush (~13:30–15:15):** if index is pinned between walls, sold premium decays fastest — defined-risk only (iron fly / narrow iron condor around the pin).
- **Max pain gravitation:** relevant only expiry afternoon and only absent fresh momentum.
- **Gamma spikes:** a wall break after 14:00 can move option prices multiples in minutes — momentum buys work but need instant SLs; this is the only regime where cheap OTM buying is structurally justified, still inside the 20% buying cap.
- Never carry ITM **stock** options into expiry without intending physical delivery.

## 4. Option Strategy Selection Matrix

| Market view | Volatility view (IV/VIX) | Structure |
| --- | --- | --- |
| Strongly directional, momentum trigger live | IV low/normal | Buy ATM/slightly-ITM option (0.4–0.6 delta) |
| Directional, moderate conviction | IV high | Debit spread (buy ATM, sell OTM) — cuts vega/theta cost |
| Directional bias, want decay on your side | IV high | Credit spread on the opposite side (e.g., bullish → put credit spread below put wall) |
| Rangebound between OI walls | IV high | Iron condor (short strikes at the walls, wings for defined risk) |
| Pinned near a strike on expiry day | Any | Iron fly, defined-risk |
| Big move expected, direction unknown (event) | IV still cheap pre-event | Long straddle/strangle — exit before IV crush post-event |
| Post-event IV crush expected | IV inflated | Short straddle **as iron fly only** (wings mandatory) |

## 5. Positional / Swing Tactics

- **Trend following:** weekly/daily structure (HH/HL) + price above 20/50 EMA; futures or deep-ITM options / bull spreads on pullbacks to the 20-EMA or 38.2–50% fib with reversal candles.
- **FII flow alignment:** hold positional longs only while FII index-futures positioning and futures basis support it; basis flipping to discount = tighten stops.
- **Event calendar:** RBI policy, monthly F&O expiry, Union Budget, Fed meetings, election results — no fresh naked-direction positions into binary events; use defined-risk structures and expect IV crush after.
- **Stock F&O specifics:** check MWPL/ban list (no fresh positions in banned symbols), delivery % trend, and results dates before any positional stock derivative.

## 6. No-Trade Conditions (as important as setups)

Stand aside when: flat VWAP + wide CPR + ADX < 20 with no OI shift (pure chop); first 15 minutes without a plan; a wide-SL setup where sizing floors to 0 lots; a signal where chart and OI disagree; within 30 minutes of a binary event; after two consecutive SL hits in a day (behavioral stop — see Part 3 journal patterns).
