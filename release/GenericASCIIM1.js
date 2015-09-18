var fs = require('fs');
var readline = require('readline');
var ForexQuote = require('./ForexQuote');
function fromFile(filename) {
    var rl = readline.createInterface({
        input: fs.createReadStream(filename),
        output: null
    });
    rl.on('line', function (line) {
        var arr = line.split(';');
        var dateTime = new Date(arr[0]);
        var open = parseFloat(arr[1]);
        var high = parseFloat(arr[2]);
        var low = parseFloat(arr[3]);
        var close = parseFloat(arr[4]);
        var volume = parseFloat(arr[5]);
        var quote = new ForexQuote(dateTime, open, high, low, close, volume);
        console.log(quote);
    });
}
exports.fromFile = fromFile;
