#include <node.h>

//http://www.ta-lib.org/hdr_dw.html
#include "ta_libc.h"

using node::AtExit;
using namespace v8;

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
    TA_RetCode retCode;
    
    Isolate* isolate = args.GetIsolate();
    
    // Parse input
    int startIdx = args[0]->NumberValue();
    int endIdx = args[1]->NumberValue();
    
    Local<Array> inArr = Local<Array>::Cast(args[2]);
    int length = inArr->Length();
    double * inReal = new double[length];
    for (int i = 0; i < length; i++) {
        inReal[i] = inArr->Get(i)->NumberValue();
    }
    
    int optInTimePeriod = args[3]->NumberValue();
    
    // Prepare output
    int outBegIdx;
    int outNBElement;
    double * outReal = new double[length];
    
    // Call TA-Lib function
    retCode = TA_SMA(startIdx, endIdx, inReal, optInTimePeriod,
                     &outBegIdx, &outNBElement, outReal);
    
    // Set return code
    args.GetReturnValue().Set(Number::New(isolate, retCode));
    
    delete[] inReal;
    
    // Get output
    Local<Array> outArr = Array::New(isolate, outNBElement);
    for (int i = 0; i < outNBElement; i++) {
        outArr->Set(i, Number::New(isolate, outReal[i]));
    }
    delete[] outReal;
    
    Local<Function> cb = Local<Function>::Cast(args[4]);
    const unsigned argc = 3;
    Local<Value> argv[argc] = {
        Number::New(isolate, outBegIdx),
        Number::New(isolate, outNBElement),
        outArr
    };
    
    // Call back javascript with output
    cb->Call(Null(isolate), argc, argv);
}

static void Shutdown(void*) {
    TA_Shutdown();
    // printf("TA-Lib did correctly shutdown.\n");
}

void init(Local<Object> exports) {
    TA_RetCode retCode = TA_Initialize();    
    if(retCode != TA_SUCCESS) {
        // printf("Cannot initialize TA-Lib (%d)!\n", retCode);
    } else {
        // printf("TA-Lib correctly initialized.\n");
        
        NODE_SET_METHOD(exports, "SMA", SMA);
        
        AtExit(Shutdown);
    }
}

NODE_MODULE(addon, init)