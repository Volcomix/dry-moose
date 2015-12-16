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
    export function SMA(
        startIdx: number,
        endIdx: number,
        inReal: number[],
        optInTimePeriod: number // From 2 to 100000
    ): {
        retCode: number,
        outBegIdx: number,
        outNBElement: number,
        outReal: number[]
    };
    
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
    export function MACD(
        startIdx: number,
        endIdx: number,
        inReal: number[],
        optInFastPeriod: number, // From 2 to 100000
        optInSlowPeriod: number, // From 2 to 100000
        optInSignalPeriod: number // From 1 to 100000
    ): {
        retCode: number,
        outBegIdx: number,
        outNBElement: number,
        outMACD: number[],
        outMACDSignal: number[],
        outMACDHist: number[]
    };
    
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
    export function BBANDS(
        startIdx: number,
        endIdx: number,
        inReal: number[],
        optInTimePeriod: number, /* From 2 to 100000 */
        optInNbDevUp: number, /* From TA_REAL_MIN to TA_REAL_MAX */
        optInNbDevDn: number, /* From TA_REAL_MIN to TA_REAL_MAX */
        optInMAType: MAType
    ): {
        retCode: number,
        outBegIdx: number,
        outNBElement: number,
        outRealUpperBand: number[],
        outRealMiddleBand: number[],
        outRealLowerBand: number[]
    }
    
    export enum MAType { Sma, Ema, Wma, Dema, Tema, Trima, Kama, Mama, T3 }
}