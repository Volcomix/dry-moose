declare module 'ta-lib' {
    export function SMA(
        startIdx: number,
        endIdx: number,
        inReal: number[],
        optInTimePeriod: number, // From 2 to 100000
        callback: (outBegIdx: number, outNBElement: number, outReal: number[]) => void);
}