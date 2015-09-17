var fs = require('fs');
var Q = require('q');
function fromFile(filename) {
    return Q.nfcall(fs.readFile, filename)
        .then(function (data) {
        var quotes = [];
        console.log('' + data);
        return quotes;
    });
}
exports.fromFile = fromFile;
