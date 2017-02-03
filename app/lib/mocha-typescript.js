"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var describeFunction = global.describe;
var skipSuiteFunction = describeFunction.skip;
var onlySuiteFunction = describeFunction.only;
var itFunction = global.it;
var skipFunction = itFunction.skip;
var onlyFunction = itFunction.only;
var pendingFunction = itFunction;
var beforeAll = global.before;
var beforeEach = global.beforeEach;
var afterAll = global.after;
var afterEach = global.afterEach;
//let nodeSymbol = global.Symbol || (key => "__mts_" + key);
var nodeSymbol = function nodeSymbol(key) {
    return "__mts_" + key;
};
var testNameSymbol = nodeSymbol("test");
var slowSymbol = nodeSymbol("slow");
var timeoutSymbol = nodeSymbol("timout");
var onlySymbol = nodeSymbol("only");
var pendingSumbol = nodeSymbol("pending");
var skipSymbol = nodeSymbol("skip");
var handled = nodeSymbol("handled");
function applyDecorators(target) {
    var timeoutValue = target[timeoutSymbol];
    if (typeof timeoutValue === "number") {
        this.timeout(timeoutValue);
    }
    var slowValue = target[slowSymbol];
    if (typeof slowValue === "number") {
        this.slow(slowValue);
    }
}
var noname = function noname(cb) {
    return cb;
};
function suite(target) {
    var decoratorName = typeof target === "string" && target;
    function result(target) {
        var targetName = decoratorName || target.name;
        var shouldSkip = target[skipSymbol];
        var shouldOnly = target[onlySymbol];
        var shouldPending = target[pendingSumbol];
        var suiteFunc = shouldSkip && skipSuiteFunction || shouldOnly && onlySuiteFunction || shouldPending && skipSuiteFunction || describeFunction;
        suiteFunc(targetName, function () {
            applyDecorators.call(this, target);
            var instance = void 0;
            if (target.before) {
                if (target.before.length > 0) {
                    beforeAll(function (done) {
                        applyDecorators.call(this, target.before);
                        return target.before(done);
                    });
                } else {
                    beforeAll(function () {
                        applyDecorators.call(this, target.before);
                        return target.before();
                    });
                }
            }
            if (target.after) {
                if (target.after.length > 0) {
                    afterAll(function (done) {
                        applyDecorators.call(this, target.after);
                        return target.after(done);
                    });
                } else {
                    afterAll(function () {
                        applyDecorators.call(this, target.after);
                        return target.after();
                    });
                }
            }
            var prototype = target.prototype;
            var beforeEachFunction = void 0;
            if (prototype.before) {
                if (prototype.before.length > 0) {
                    beforeEachFunction = noname(function (done) {
                        instance = new target();
                        applyDecorators.call(this, prototype.before);
                        return prototype.before.call(instance, done);
                    });
                } else {
                    beforeEachFunction = noname(function () {
                        instance = new target();
                        applyDecorators.call(this, prototype.before);
                        return prototype.before.call(instance);
                    });
                }
            } else {
                beforeEachFunction = noname(function () {
                    instance = new target();
                });
            }
            beforeEach(beforeEachFunction);
            var afterEachFunction = void 0;
            if (prototype.after) {
                if (prototype.after.length > 0) {
                    afterEachFunction = noname(function (done) {
                        try {
                            applyDecorators.call(this, prototype.after);
                            return prototype.after.call(instance, done);
                        } finally {
                            instance = undefined;
                        }
                    });
                } else {
                    afterEachFunction = noname(function () {
                        try {
                            applyDecorators.call(this, prototype.after);
                            return prototype.after.call(instance);
                        } finally {
                            instance = undefined;
                        }
                    });
                }
            } else {
                afterEachFunction = noname(function () {
                    instance = undefined;
                });
            }
            afterEach(afterEachFunction);
            Object.getOwnPropertyNames(prototype).forEach(function (key) {
                try {
                    var _ret = function () {
                        var method = prototype[key];
                        if (method === target) {
                            return {
                                v: void 0
                            };
                        }
                        var testName = method[testNameSymbol];
                        var shouldSkip = method[skipSymbol];
                        var shouldOnly = method[onlySymbol];
                        var shouldPending = method[pendingSumbol];
                        var testFunc = shouldSkip && skipFunction || shouldOnly && onlyFunction || itFunction;
                        if (testName || shouldOnly || shouldPending || shouldSkip) {
                            testName = testName || method.name;
                            if (shouldPending && !shouldSkip && !shouldOnly) {
                                pendingFunction(testName);
                            } else if (method.length > 0) {
                                testFunc(testName, noname(function (done) {
                                    applyDecorators.call(this, method);
                                    return method.call(instance, done);
                                }));
                            } else {
                                testFunc(testName, noname(function () {
                                    applyDecorators.call(this, method);
                                    return method.call(instance);
                                }));
                            }
                        }
                    }();

                    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
                } catch (e) {}
            });
        });
    }
    return decoratorName ? result : result(target);
}
exports.suite = suite;
function test(target, propertyKey) {
    var decoratorName = typeof target === "string" && target;
    var result = function result(target, propertyKey) {
        target[propertyKey][testNameSymbol] = decoratorName || propertyKey;
    };
    return decoratorName ? result : result(target, propertyKey);
}
exports.test = test;
/**
 * Set a test method execution time that is considered slow.
 * @param time The time in miliseconds.
 */
function slow(time) {
    return function (target, propertyKey) {
        if (arguments.length === 1) {
            target[slowSymbol] = time;
        } else {
            target[propertyKey][slowSymbol] = time;
        }
    };
}
exports.slow = slow;
/**
 * Set a test method or suite timeout time.
 * @param time The time in miliseconds.
 */
function timeout(time) {
    return function (target, propertyKey) {
        if (arguments.length === 1) {
            target[timeoutSymbol] = time;
        } else {
            target[propertyKey][timeoutSymbol] = time;
        }
    };
}
exports.timeout = timeout;
/**
 * Mart a test or suite as pending.
 *  - Used as `@suite @pending class` is `describe.skip("name", ...);`.
 *  - Used as `@test @pending method` is `it("name");`
 */
function pending(target, propertyKey) {
    if (arguments.length === 1) {
        target[pendingSumbol] = true;
    } else {
        target[propertyKey][pendingSumbol] = true;
    }
}
exports.pending = pending;
/**
 * Mark a test or suite as the only one to execute.
 *  - Used as `@suite @only class` is `describe.only("name", ...)`.
 *  - Used as `@test @only method` is `it.only("name", ...)`.
 */
function only(target, propertyKey) {
    if (arguments.length === 1) {
        target[onlySymbol] = true;
    } else {
        target[propertyKey][onlySymbol] = true;
    }
}
exports.only = only;
/**
 * Mark a test or suite to skip.
 *  - Used as `@suite @skip class` is `describe.skip("name", ...);`.
 *  - Used as `@test @skip method` is `it.skip("name")`.
 */
function skip(target, propertyKey) {
    if (arguments.length === 1) {
        target[onlySymbol] = true;
    } else {
        target[propertyKey][skipSymbol] = true;
    }
}
exports.skip = skip;
//# sourceMappingURL=index.js.map
