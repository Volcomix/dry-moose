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

}