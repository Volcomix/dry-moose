var TA = require('../build/Release/ta-lib');

var inReal = [];

for (var i = 0; i < 10; i++) {
	inReal[i] = Math.floor(Math.random() * 50);
}

// Simple Moving Average
//
// TA.SMA(/*Number*/ startIdx,
//        /*Number*/ endIdx,
//        /*const Array<Number>*/ inReal[],
//        /*Number*/ optInTimePeriod, // From 2 to 100000
//        /*Function(Number outBegIdx, Number outNBElement, Array<Number> outReal)*/ callback)
// Returns: Number (TA_RetCode)
var retCode = TA.SMA(0, inReal.length - 1, inReal, 3, function(outBegIdx, outNBElement, outReal) {
	var i;
	for (i = 0; i < outBegIdx; i++) {
		console.log('Day ' + i + ': ' + inReal[i]);
	}
	for (i = 0; i < outNBElement; i++) {
		console.log('Day ' + (outBegIdx + i) + ': ' +
					inReal[outBegIdx + i] + ' -> ' + outReal[i].toFixed(2));
	}
});

console.log('Return code: ' + retCode);