# Startup requests

1. `https://api.etorostatic.com/sapi/candles/closingprices.json`
```json
[ { "InstrumentId": 1,
    "OfficialClosingPrice": 1.1775,
    "IsMarketOpen": false,
    "ClosingPrices":
    { "Daily": { "Price": 1.1847, "Date": "2017-10-19 00:00:00Z" },
      "Weekly": { "Price": 1.1822, "Date": "2017-10-13 00:00:00Z" },
      "Monthly": { "Price": 1.182, "Date": "2017-09-29 00:00:00Z" } } },
  "..." ]
```
2. `https://api.etorostatic.com/sapi/instrumentsmetadata/V1.1/instruments`
```json
{ "InstrumentDisplayDatas":
  [ { "InstrumentID": 1,
      "InstrumentDisplayName": "EUR/USD",
      "InstrumentTypeID": 1,
      "ExchangeID": 1,
      "Images":
      [ { "Width": 35,
          "Height": 35,
          "Uri": "https://etoro-cdn.etorostatic.com/market-avatars/eur-usd/35x35.png" },
        { "Width": 80, "Height": 80, "Uri": "/medium/EUR_USD.png" },
        { "Width": 50,
          "Height": 50,
          "Uri": "https://etoro-cdn.etorostatic.com/market-avatars/eur-usd/50x50.png" },
        { "Width": 150,
          "Height": 150,
          "Uri": "https://etoro-cdn.etorostatic.com/market-avatars/eur-usd/150x150.png" },
        { "Width": 70,
          "Height": 70,
          "Uri": "https://etoro-cdn.etorostatic.com/market-avatars/eur-usd/70x70.png" } ],
      "SymbolFull": "EURUSD" },
    "..." ] }
```
3. `https://api.etorostatic.com/sapi/trade-real/instruments?InstrumentDataFilters`
```json
{ "Instruments":
  [ { "Leverage1MaintenanceMargin": 100,
      "InstrumentID": 1,
      "AllowManualTrading": true,
      "Leverages": [ 1, 2, 5, 10, 25, 50, 100, 200, 400 ],
      "DefaultLeverage": 50,
      "MinPositionAmount": 25,
      "MaxStopLossPercentage": 100,
      "MaxTakeProfitPercentage": 1000,
      "MinPositionAmountAbsolute": 25,
      "SellEndOfWeekFee": -0.000009,
      "BuyEndOfWeekFee": 0.00018,
      "Precision": 4,
      "TypeID": 1,
      "UnitMargin": 1,
      "BuyOverNightFee": 0.00006,
      "SellOverNightFee": -0.000003,
      "MaxPositionUnits": 2000000,
      "IsDelisted": false,
      "BuyCurrencyID": 2,
      "SellCurrencyID": 1,
      "MaxRateDiffPercentage": 0,
      "NonLeveragedSellEndOfWeekFee": -0.000009,
      "NonLeveragedBuyEndOfWeekFee": 0.00018,
      "LeveragedSellEndOfWeekFee": -0.000009,
      "LeveragedBuyEndOfWeekFee": 0.00018,
      "NonLeveragedBuyOverNightFee": 0.00006,
      "NonLeveragedSellOverNightFee": -0.000003,
      "LeveragedBuyOverNightFee": 0.00006,
      "LeveragedSellOverNightFee": -0.000003,
      "IsVisible": false,
      "AllowPendingOrders": true,
      "AllowEntryOrders": true,
      "AllowSell": true,
      "AllowBuy": true,
      "AllowClosePosition": true,
      "AllowExitOrder": true,
      "IsGuaranteeSlTp": false,
      "AllowEditSlTp": true,
      "RestrictedManualOpen": false },
    "..." ] }
```
4. `https://api.etorostatic.com/sapi/app-data/web-client/app-data/instruments-groups.json`
```json
{ "InstrumentTypes":
  [ { "InstrumentTypeID": 10,
      "InstrumentTypeDescription": "Cryptocurrencies",
      "Order": 5,
      "SLTPApproachPercent": 1,
      "PricesBy": "eToro",
      "Avatars":
      { "default": "https://etoro-cdn.etorostatic.com/web-client/img/avatars/Cyrptocurrencies.png" } },
    "..." ],
  "ExchangeInfo":
  [ { "ExchangeID": 4, "ExchangeDescription": "NASDAQ" },
    "..." ],
  "StocksIndustries":
  [ { "IndustryID": 1, "IndustryName": "BasicMaterials" },
    "..." ] }
```
5. `https://www.etoro.com/sapi/trade-real/instruments/?InstrumentDataFilters`
> Multiple times
```json
{ "InstrumentsToActivityState":
  { "1": false,
    "..." },
  "Rates":
  [ { "InstrumentID": 1,
      "Ask": 1.1778,
      "Bid": 1.1775,
      "LastExecution": 1.17771,
      "ConversionRateAsk": 1,
      "ConversionRateBid": 1,
      "Date": "2017-10-20T20:30:01.0983823Z",
      "UnitMargin": 1.1775 },
    "..." ] }
```
6. `https://www.etoro.com/sapi/trade-real/instruments/private?InstrumentDataFilters`
```json
{ "PrivateInstruments":
  [ { "Leverage1MaintenanceMargin": 100,
      "InstrumentID": 1,
      "AllowManualTrading": true,
      "Leverages": [ 1, 2, 5, 10, 25, 50, 100, 200, 400 ],
      "DefaultLeverage": 50,
      "MinPositionAmount": 5000,
      "MaxStopLossPercentage": 100,
      "MaxTakeProfitPercentage": 1000,
      "MinPositionAmountAbsolute": 25,
      "IsGuaranteeSlTp": false,
      "RestrictedManualOpen": false },
    "..." ] }
```
7. `https://www.etoro.com/sapi/insights/insights/uniques`
```json
[ { "instrumentId": 1,
    "buy": 44,
    "sell": 56,
    "prevBuy": 40,
    "prevSell": 60,
    "growth": -6.333830104321907,
    "total": 2536,
    "percentage": 3.229873785294904 },
  "..." ]
```