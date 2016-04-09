declare module 'ta-lib' {
    
    /**
     * TA_SMA - Simple Moving Average
     * 
     * Input  = double
     * Output = double
     * 
     * Optional Parameters
     * -------------------
     * optInTimePeriod:(From 2 to 100000)
     *    Number of period
     */
    function SMA(
        startIdx: number,
        endIdx: number,
        inReal: number[],
        optInTimePeriod: number // From 2 to 100000
    ): SMA.Result
    
    module SMA {
        interface Result extends TAResult {
            outReal: number[];
        }
    }
    
    /**
     * TA_MACD - Moving Average Convergence/Divergence
     * 
     * Input  = double
     * Output = double, double, double
     * 
     * Optional Parameters
     * -------------------
     * optInFastPeriod:(From 2 to 100000)
     *    Number of period for the fast MA
     * 
     * optInSlowPeriod:(From 2 to 100000)
     *    Number of period for the slow MA
     * 
     * optInSignalPeriod:(From 1 to 100000)
     *    Smoothing for the signal line (nb of period)
     */
    function MACD(
        startIdx: number,
        endIdx: number,
        inReal: number[],
        optInFastPeriod: number, // From 2 to 100000
        optInSlowPeriod: number, // From 2 to 100000
        optInSignalPeriod: number // From 1 to 100000
    ): MACD.Result
    
    module MACD {
        interface Result extends TAResult {
            outMACD: number[];
            outMACDSignal: number[];
            outMACDHist: number[];
        } 
    }
    
    /*
     * TA_BBANDS - Bollinger Bands
     * 
     * Input  = double
     * Output = double, double, double
     * 
     * Optional Parameters
     * -------------------
     * optInTimePeriod:(From 2 to 100000)
     *    Number of period
     * 
     * optInNbDevUp:(From TA_REAL_MIN to TA_REAL_MAX)
     *    Deviation multiplier for upper band
     * 
     * optInNbDevDn:(From TA_REAL_MIN to TA_REAL_MAX)
     *    Deviation multiplier for lower band
     * 
     * optInMAType:
     *    Type of Moving Average
     */
    function BBANDS(
        startIdx: number,
        endIdx: number,
        inReal: number[],
        optInTimePeriod: number, /* From 2 to 100000 */
        optInNbDevUp: number, /* From TA_REAL_MIN to TA_REAL_MAX */
        optInNbDevDn: number, /* From TA_REAL_MIN to TA_REAL_MAX */
        optInMAType: MAType
    ): BBANDS.Result
    
    module BBANDS {
        interface Result extends TAResult {
            outRealUpperBand: number[];
            outRealMiddleBand: number[];
            outRealLowerBand: number[];
        }
    }
    
    interface TAResult {
        retCode: number;
        outBegIdx: number;
        outNBElement: number;
    }
    
    export const enum MAType { Sma, Ema, Wma, Dema, Tema, Trima, Kama, Mama, T3 }
}