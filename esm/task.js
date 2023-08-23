import { _ as __read } from './tslib.es6-86caa7c8.js';
import { isFunction } from './tools.js';

var TaskQueue = /** @class */ (function () {
    function TaskQueue(threadNum) {
        if (threadNum === void 0) { threadNum = 1; }
        this._threadNum = 1;
        this._totalCount = 0;
        this._finishCount = 0;
        this._taskArray = [];
        this.onFinishing = function () { return 0; };
        this.onProcessing = function () { return 0; };
        this.onErroring = function () { return 0; };
        this._threadNum = threadNum;
    }
    Object.defineProperty(TaskQueue.prototype, "totalCount", {
        get: function () {
            return this._totalCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "finishCount", {
        get: function () {
            return this._finishCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TaskQueue.prototype, "progress", {
        get: function () {
            if (this.totalCount) {
                return (this.finishCount / this.totalCount).toFixed(2);
            }
            else {
                return 0;
            }
        },
        enumerable: false,
        configurable: true
    });
    TaskQueue.prototype.add = function (task) {
        this._taskArray.push(task);
        this._totalCount++;
        return this;
    };
    TaskQueue.prototype.addMany = function (tasks) {
        var _this = this;
        tasks.forEach(function (it) { return _this.add(it); });
        return this;
    };
    TaskQueue.prototype.run = function () {
        var _this = this;
        var tasks = this.shiftElements(this._threadNum);
        Promise.all(tasks.map(function (it) { return _this.execute(it); })).finally(function () {
            setTimeout(function () {
                var _a;
                if (!_this._taskArray.length) {
                    (_a = _this.onFinishing) === null || _a === void 0 ? void 0 : _a.call(_this);
                    return;
                }
            });
        });
    };
    TaskQueue.prototype.shiftElements = function (num) {
        var result = [];
        for (var index = 0; index < num && this._taskArray.length; index++) {
            var el = this._taskArray.shift();
            result.push(el);
        }
        return result;
    };
    TaskQueue.prototype.execute = function (task) {
        var _this = this;
        if (!task) {
            return Promise.resolve();
        }
        return task().then(function (res) { return setTimeout(function () {
            var _a;
            (_a = _this.onProcessing) === null || _a === void 0 ? void 0 : _a.call(_this, res);
        }); }).catch(function (err) { return setTimeout(function () {
            var _a;
            (_a = _this.onErroring) === null || _a === void 0 ? void 0 : _a.call(_this, err);
        }); }).finally(function () {
            _this._finishCount++;
            var _a = __read(_this.shiftElements(1), 1), newTask = _a[0];
            return _this.execute(newTask);
        });
    };
    TaskQueue.prototype.onFinish = function (fn) {
        if (isFunction(fn)) {
            this.onFinishing = fn;
        }
        return this;
    };
    TaskQueue.prototype.onProcess = function (fn) {
        if (isFunction(fn)) {
            this.onProcessing = fn;
        }
        return this;
    };
    TaskQueue.prototype.onError = function (fn) {
        if (isFunction(fn)) {
            this.onErroring = fn;
        }
        return this;
    };
    TaskQueue.prototype.reset = function () {
        this._finishCount = 0;
        this._totalCount = 0;
        this._taskArray = [];
        return this;
    };
    return TaskQueue;
}());

export { TaskQueue as default };
