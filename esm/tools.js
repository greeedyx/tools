import { b as __values } from './tslib.es6-86caa7c8.js';

function sleep(ms) {
    positiveCheck(ms);
    return new Promise(function (resolve) {
        if (ms)
            setTimeout(function () {
                resolve(null);
            }, ms);
    });
}
function positiveCheck(n) {
    if (n < 0) {
        throw new Error("\u6570\u503C\u4E0D\u80FD\u5C0F\u4E8E0");
    }
}
function isBlank(v) {
    if (isEmpty(v)) {
        return true;
    }
    return !String(v).trim().length;
}
function isEmpty(v) {
    if (v === "" || v === undefined || v === null) {
        return true;
    }
    return false;
}
function isObject(v) {
    return typeof v === 'object' && v !== null;
}
function isFunction(v) {
    return typeof v === 'function';
}
function isArray(v) {
    return Object.prototype.toString.call(v) === "[object Array]";
}
function debounce(fn, ms) {
    if (ms === void 0) { ms = 500; }
    positiveCheck(ms);
    var timer;
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            // @ts-ignore
            fn.apply(_this, args);
            timer && clearTimeout(timer);
            timer = null;
        }, ms);
    };
}
function throttle(fn, ms) {
    if (ms === void 0) { ms = 500; }
    positiveCheck(ms);
    var timer;
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!timer) {
            timer = setTimeout(function () {
                // @ts-ignore
                fn.apply(_this, args);
                timer && clearTimeout(timer);
                timer = null;
            }, ms);
        }
    };
}
function _underline(name) {
    if (isEmpty(name)) {
        return name;
    }
    return name.toString().replace(/([A-Z])/g, "_$1").toLowerCase();
}
function underline(o) {
    if (isArray(o)) {
        return o.map(function (it) { return underline(it); });
    }
    if (isObject(o)) {
        var result_1 = {};
        Object.keys(o).forEach(function (k) {
            var newKey = _underline(k);
            result_1[newKey] = o[k];
        });
        return result_1;
    }
    else {
        return _underline(o);
    }
}
function _camel(name) {
    if (isEmpty(name)) {
        return name;
    }
    return name.toString().replace(/_(\w)/g, function (all, letter) { return letter.toUpperCase(); });
}
function camel(o) {
    if (Array.isArray(o)) {
        return o.map(function (it) { return camel(it); });
    }
    if (isObject(o)) {
        var result_2 = {};
        Object.keys(o).forEach(function (k) {
            var newKey = _camel(k);
            result_2[newKey] = o[k];
        });
        return result_2;
    }
    else {
        return _camel(o);
    }
}
function sequenceExec(ps) {
    var e_1, _a;
    var result = [];
    var pro = Promise.resolve(result);
    var _loop_1 = function (p) {
        pro = pro.then(function () { return p(); }).then(function (r) {
            result.push(r);
            return result;
        });
    };
    try {
        for (var ps_1 = __values(ps), ps_1_1 = ps_1.next(); !ps_1_1.done; ps_1_1 = ps_1.next()) {
            var p = ps_1_1.value;
            _loop_1(p);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (ps_1_1 && !ps_1_1.done && (_a = ps_1.return)) _a.call(ps_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return pro;
}

export { camel, debounce, isArray, isBlank, isEmpty, isFunction, isObject, sequenceExec, sleep, throttle, underline };
