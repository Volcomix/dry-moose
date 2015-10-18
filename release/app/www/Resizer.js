/// <reference path="../../../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Resizer = (function (_super) {
    __extends(Resizer, _super);
    function Resizer() {
        var _this = this;
        _super.apply(this, arguments);
        this.handleResize = function () {
            if (!_this.resizer)
                return;
            _this.setState({
                width: _this.resizer.offsetWidth,
                height: _this.resizer.offsetHeight
            });
        };
    }
    Resizer.prototype.componentDidMount = function () {
        window.addEventListener('resize', this.handleResize);
    };
    Resizer.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.handleResize);
    };
    Resizer.prototype.render = function () {
        var _this = this;
        if (!this.state) {
            return (React.createElement("div", {"ref": function (ref) { return ref && _this.setState({
                width: ref.offsetWidth,
                height: ref.offsetHeight
            }); }, "style": Resizer.fill}));
        }
        return (React.createElement("div", {"ref": function (ref) { return _this.resizer = ref; }, "style": Resizer.fill}, React.cloneElement(this.props.children, {
            width: this.state.width,
            height: this.state.height
        })));
    };
    Resizer.fill = {
        width: '100%',
        height: '100%'
    };
    return Resizer;
})(React.Component);
module.exports = Resizer;
