#include <node.h>

//http://www.ta-lib.org/hdr_dw.html
#include "ta_libc.h"

using node::AtExit;
using namespace v8;

double* v8ToDoubleArray(Local<Array> arr, int length) {
    double* result = new double[length];
    for (int i = 0; i < length; i++) {
        result[i] = arr->Get(i)->NumberValue();
    }
    return result;
}

Local<Array> doubleArrayToV8(Isolate* isolate, double* arr, int length) {
    Local<Array> result = Array::New(isolate, length);
    for (int i = 0; i < length; i++) {
        result->Set(i, Number::New(isolate, arr[i]));
    }
    return result;
}

/*
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
void SMA(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    
    // Get input
    int startIdx = args[0]->NumberValue();
    int endIdx = args[1]->NumberValue();
    
    Local<Array> inArr = Local<Array>::Cast(args[2]);
    int length = inArr->Length();
    double* inReal = v8ToDoubleArray(inArr, length);
    
    int optInTimePeriod = args[3]->NumberValue();
    
    // Prepare output
    TA_RetCode retCode;
    int outBegIdx;
    int outNBElement;
    
    double * outReal = new double[length];
    
    // Call TA-Lib function
    retCode = TA_SMA(startIdx, endIdx, inReal, optInTimePeriod,
                     &outBegIdx, &outNBElement, outReal);

    delete[] inReal;
    
    // Get output
    Local<Array> outArr = doubleArrayToV8(isolate, outReal, outNBElement);
    
    delete[] outReal;
    
    // Set up result
    Local<Object> obj = Object::New(isolate);
    obj->Set(String::NewFromUtf8(isolate, "retCode"), Number::New(isolate, retCode));
    obj->Set(String::NewFromUtf8(isolate, "outBegIdx"), Number::New(isolate, outBegIdx));
    obj->Set(String::NewFromUtf8(isolate, "outNBElement"), Number::New(isolate, outNBElement));
    obj->Set(String::NewFromUtf8(isolate, "outReal"), outArr);
    
    args.GetReturnValue().Set(obj);
}

/*
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
void MACD(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    
    // Get input
    int startIdx = args[0]->NumberValue();
    int endIdx = args[1]->NumberValue();
    
    Local<Array> inArr = Local<Array>::Cast(args[2]);
    int length = inArr->Length();
    double* inReal = v8ToDoubleArray(inArr, length);
    
    int optInFastPeriod = args[3]->NumberValue();
    int optInSlowPeriod = args[4]->NumberValue();
    int optInSignalPeriod = args[5]->NumberValue();
    
    // Prepare output
    TA_RetCode retCode;
    int outBegIdx;
    int outNBElement;
    
    double * outMACD = new double[length];
    double * outMACDSignal = new double[length];
    double * outMACDHist = new double[length];
    
    // Call TA-Lib function
    retCode = TA_MACD(startIdx, endIdx, inReal,
                      optInFastPeriod, optInSlowPeriod, optInSignalPeriod,
                      &outBegIdx, &outNBElement, outMACD, outMACDSignal, outMACDHist);

    delete[] inReal;
    
    // Get output
    Local<Array> v8MACD = doubleArrayToV8(isolate, outMACD, outNBElement);
    Local<Array> v8MACDSignal = doubleArrayToV8(isolate, outMACDSignal, outNBElement);
    Local<Array> v8MACDHist = doubleArrayToV8(isolate, outMACDHist, outNBElement);
    
    delete[] outMACD;
    delete[] outMACDSignal;
    delete[] outMACDHist;
    
    // Set up result
    Local<Object> obj = Object::New(isolate);
    obj->Set(String::NewFromUtf8(isolate, "retCode"), Number::New(isolate, retCode));
    obj->Set(String::NewFromUtf8(isolate, "outBegIdx"), Number::New(isolate, outBegIdx));
    obj->Set(String::NewFromUtf8(isolate, "outNBElement"), Number::New(isolate, outNBElement));
    obj->Set(String::NewFromUtf8(isolate, "outMACD"), v8MACD);
    obj->Set(String::NewFromUtf8(isolate, "outMACDSignal"), v8MACDSignal);
    obj->Set(String::NewFromUtf8(isolate, "outMACDHist"), v8MACDHist);
    
    args.GetReturnValue().Set(obj);
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
void BBANDS(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    
    // Get input
    int startIdx = args[0]->NumberValue();
    int endIdx = args[1]->NumberValue();
    
    Local<Array> inArr = Local<Array>::Cast(args[2]);
    int length = inArr->Length();
    double* inReal = v8ToDoubleArray(inArr, length);
    
    int optInTimePeriod = args[3]->NumberValue();
    double optInNbDevUp = args[4]->NumberValue();
    double optInNbDevDn = args[5]->NumberValue();
    TA_MAType optInMAType = (TA_MAType)args[6]->NumberValue();
    
    // Prepare output
    TA_RetCode retCode;
    int outBegIdx;
    int outNBElement;
    
    double * outRealUpperBand = new double[length];
    double * outRealMiddleBand = new double[length];
    double * outRealLowerBand = new double[length];
    
    // Call TA-Lib function
    retCode = TA_BBANDS(startIdx, endIdx, inReal,
                        optInTimePeriod, optInNbDevUp, optInNbDevDn, optInMAType,
                        &outBegIdx, &outNBElement,
                        outRealUpperBand, outRealMiddleBand, outRealLowerBand);

    delete[] inReal;
    
    // Get output
    Local<Array> v8RealUpperBand = doubleArrayToV8(isolate, outRealUpperBand, outNBElement);
    Local<Array> v8RealMiddleBand = doubleArrayToV8(isolate, outRealMiddleBand, outNBElement);
    Local<Array> v8RealLowerBand = doubleArrayToV8(isolate, outRealLowerBand, outNBElement);
    
    delete[] outRealUpperBand;
    delete[] outRealMiddleBand;
    delete[] outRealLowerBand;
    
    // Set up result
    Local<Object> obj = Object::New(isolate);
    obj->Set(String::NewFromUtf8(isolate, "retCode"), Number::New(isolate, retCode));
    obj->Set(String::NewFromUtf8(isolate, "outBegIdx"), Number::New(isolate, outBegIdx));
    obj->Set(String::NewFromUtf8(isolate, "outNBElement"), Number::New(isolate, outNBElement));
    obj->Set(String::NewFromUtf8(isolate, "outRealUpperBand"), v8RealUpperBand);
    obj->Set(String::NewFromUtf8(isolate, "outRealMiddleBand"), v8RealMiddleBand);
    obj->Set(String::NewFromUtf8(isolate, "outRealLowerBand"), v8RealLowerBand);
    
    args.GetReturnValue().Set(obj);
}


static void Shutdown(void*) {
    TA_Shutdown();
}

void init(Local<Object> exports) {
    if(TA_Initialize() == TA_SUCCESS) {
        
        NODE_SET_METHOD(exports, "SMA", SMA);
        NODE_SET_METHOD(exports, "MACD", MACD);
        NODE_SET_METHOD(exports, "BBANDS", BBANDS);
        
        AtExit(Shutdown);
    }
}

NODE_MODULE(addon, init)