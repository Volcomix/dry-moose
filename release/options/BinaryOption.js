/// <reference path="../../typings/tsd.d.ts" />
var BinaryOption = (function () {
    function BinaryOption(option) {
        this.option = option;
    }
    return BinaryOption;
})();
var BinaryOption;
(function (BinaryOption) {
    (function (_option) {
        _option[_option["Call"] = 0] = "Call";
        _option[_option["Put"] = 1] = "Put";
        _option[_option["None"] = 2] = "None";
    })(BinaryOption._option || (BinaryOption._option = {}));
    var _option = BinaryOption._option;
    ;
    BinaryOption.Call = new BinaryOption(_option.Call);
    BinaryOption.Put = new BinaryOption(_option.Put);
    BinaryOption.None = new BinaryOption(_option.None);
})(BinaryOption || (BinaryOption = {}));
module.exports = BinaryOption;
