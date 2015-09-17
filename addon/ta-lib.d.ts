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
     *      Number of period
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
    
}