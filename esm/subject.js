import { a as __spreadArray, _ as __read, b as __values } from './tslib.es6-86caa7c8.js';

var Subject = /** @class */ (function () {
    function Subject(history) {
        if (history === void 0) { history = true; }
        this.map = new Map();
        this.args = [];
        this.containHistory = history;
    }
    Subject.prototype.unsubscribe = function (key) {
        this.map.delete(key);
    };
    Subject.prototype.subscribe = function (callback) {
        var _this = this;
        var key = "".concat(new Date().getTime(), "_").concat(Math.random());
        this.map.set(key, callback);
        if (this.args.length && this.containHistory) {
            setTimeout(function () { return callback.apply(void 0, __spreadArray([], __read(_this.args[_this.args.length - 1]), false)); });
        }
        return key;
    };
    Subject.prototype.next = function () {
        var e_1, _a;
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        var args = arg || [];
        this.args.push(args);
        var values = this.map.values();
        try {
            for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                var callback = values_1_1.value;
                callback.apply(void 0, __spreadArray([], __read(args), false));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Subject.prototype.clear = function () {
        this.args = [];
        this.map = new Map();
    };
    return Subject;
}());

export { Subject as default };
