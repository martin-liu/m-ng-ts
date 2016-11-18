import DomService from './dom.service.ts';

export default class Util {
  static $inject = ['$uibModal', '$timeout', '$location', '$anchorScroll', '$window',
                    '$http', '$templateCache', '$compile', '$q', '$route', 'Cache'];
  private alertTpl = require('../partials/alert.html');
  dom:any;

  constructor(private $uibModal:any, private $timeout:any, private $location:any, private $anchorScroll:any,
              private $window:any, private $http:any, private $templateCache:any,
              private $compile:any, private $q:any, private $route:any, private Cache:any) {
    this.dom = DomService;
  }

  createDialog(template, scope, thenFunc, options?) {
    let closed, dialog;
    if (options == null) {
      options = {};
    }
    closed = false;
    options = angular.extend({
      backdropFade: true,
      template: template,
      controller: [
        "$scope", "$uibModalInstance", "scope", function($scope, $uibModalInstance, scope) {
          $scope = angular.extend($scope, scope);
          return $scope.close = function(data) {
            if (!closed) {
              $uibModalInstance.close(data);
              return closed = true;
            }
          };
        }
      ],
      resolve: {
        scope: function() {
          return scope;
        }
      }
    }, options);
    dialog = this.$uibModal.open(options);
    dialog.result.then(thenFunc);
    return dialog;
  }

  alert(message, type, thenFunc) {
    let mclass, scope;
    mclass = (function() {
      switch (type) {
      case 'success':
        return 'alert-success';
      case 'fail':
        return 'alert-danger';
      case 'confirm':
        return 'alert-warning';
      }
    })();
    scope = {
      message: message,
      type: type,
      "class": mclass
    };
    return this.createDialog(this.alertTpl, scope, thenFunc);
  }

  success(message, thenFunc) {
    return this.alert(message, 'success', thenFunc);
  }

  fail(message, thenFunc) {
    return this.alert(message, 'fail', thenFunc);
  }

  confirm(message, thenFunc) {
    return this.alert(message, 'confirm', thenFunc);
  }

  error(message) {
    let tplErrorHandler;
    tplErrorHandler = 'partials/modal/error_handler.html';
    return this.createDialog(tplErrorHandler, {
      message: message
    }, function() {});
  }

  compileTemplate(templateUrl, scope) {
    let defer, loader;
    defer = this.$q.defer();
    loader = this.$http.get(templateUrl, {
      cache: this.$templateCache
    });
    loader.success(function(html) {
      return defer.resolve(this.$compile(html)(scope));
    });
    return defer.promise;
  }

  toggleFullscreen(e) {
    angular.element(document.body).toggleClass('fullscreenStatic');
    return angular.element(e).toggleClass('fullscreen');
  }

  daysBetween(date1, date2) {
    let date1_ms, date2_ms, difference_ms, one_day;
    one_day = 1000 * 60 * 60 * 24;
    date1_ms = date1.getTime();
    date2_ms = date2.getTime();
    difference_ms = Math.abs(date2_ms - date1_ms);
    return Math.round(difference_ms / one_day);
  }

  formatDate(date) {
    if (date === '0000-00-00 00:00:00') {
      return '';
    } else {
      return date;
    }
  }

  truncDate(date) {
    if (!date || date === '0000-00-00') {
      return '';
    } else {
      return date.match(/\S+/g)[0];
    }
  }

  truncateCharacter(input, chars, breakOnWord) {
    let lastspace;
    if (isNaN(chars)) {
      return input;
    }
    if (chars <= 0) {
      return '';
    }
    if (input && input.length >= chars) {
      input = input.substring(0, chars);
      if (!breakOnWord) {
        lastspace = input.lastIndexOf(' ');
        if (lastspace !== -1) {
          input = input.substr(0, lastspace);
        }
      } else {
        while (input.charAt(input.length - 1) === ' ') {
          input = input.substr(0, input.length(-1));
        }
      }
      return input + '...';
    }
    return input;
  }

  redirect(path, force) {
    path = path.replace('%', '');
    if (this.$location.url() !== path) {
      return this.$location.url(path);
    } else {
      if (force) {
        return this.$route.reload();
      }
    }
  }

  reload() {
    return this.$route.reload();
  }

  scrollTo(height) {
    return this.$window.scrollTo(0, height);
  }

  setUpScrollHandler(elId, event) {
    return this.$timeout(function() {
      let el;
      el = document.getElementById(elId);
      if (el) {
        this.$anchorScroll();
        return angular.element(el).triggerHandler(event);
      }
    }, 0);
  }

  getParams() {
    return this.$location.search();
  }

  getUserParam(user) {
    return {
      nt: user.nt,
      fullname: user.displayName,
      label: user.label
    };
  }

  getWithCache(key, isSession, getFunc, timeout) {
    let cache, data, defer, promise;
    cache = this.Cache;
    if (isSession) {
      cache = this.Cache.session;
    }
    defer = this.$q.defer();
    data = cache.get(key);
    if (data) {
      defer.resolve(data);
      return defer.promise;
    } else {
      promise = getFunc();
      promise.then(function(data) {
        let e;
        try {
          return cache.set(key, data, timeout);
        } catch (_error) {
          e = _error;
          return console.log(e);
        }
      });
      return promise;
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  solrEscape(q) {
    return q.replace(/[+\-\!\(\)\{\}\[\]\^"~\*\?:\\]+/g, ' ');
  }

  removeHtmlTags(str) {
    return str.replace(/<[^>]*>?/g, '');
  }

  waitUntil(func, check = (d) => !!d, interval = 300, maxTime = 100) {
    let doWait = (time) => {
      return new Promise((rs, rj) => {
        if (time <= 0) {
          rj("exceed " + maxTime + " times check");
        } else {
          let ret = func();
          if (check(ret)) {
            rs(ret);
          } else {
            setTimeout(() => {
              return doWait(time - 1).then(rs).catch(rj);
            }, interval);
          }
        }
      });
    };
    return doWait(maxTime);
  }

  recurUntil(func, check, args, nextArgsFunc, maxTime) {
    let doRecur;
    if (maxTime == null) {
      maxTime = 100;
    }
    doRecur = function(time, lastRet) {
      let defer, ret;
      defer = this.$q.defer();
      if (time <= 0) {
        defer.reject("exceed " + maxTime + " times check");
      } else {
        if (time === maxTime) {
          ret = func.apply(this, args);
        } else {
          ret = func.apply(this, nextArgsFunc(lastRet));
        }
        if (check(ret)) {
          defer.resolve(ret);
        } else {
          doRecur(time - 1, ret).then(function(ret) {
            return defer.resolve(ret);
          }, function(err) {
            return defer.reject(err);
          });
        }
      }
      return defer.promise;
    };
    return doRecur(maxTime);
  }

  deepExtend() {
    let args, target;
    if (arguments.length < 1 || typeof arguments[0] !== "object") {
      return false;
    }
    if (arguments.length < 2) {
      return arguments[0];
    }
    target = arguments[0];
    args = Array.prototype.slice.call(arguments, 1);
    args.forEach((function(_this) {
      return function(obj) {
        let clone, key, src, val, _results;
        if (typeof obj !== "object") {
          return;
        }
        _results = [];
        for (key in obj) {
          if (!(key in obj)) {
            continue;
          }
          src = target[key];
          val = obj[key];
          if (val === target) {
            continue;
          }
          if (typeof val !== "object" || val === null) {
            target[key] = val;
            continue;
          } else if (val instanceof Date) {
            target[key] = new Date(val.getTime());
            continue;
          } else if (val instanceof RegExp) {
            target[key] = new RegExp(val);
            continue;
          }
          if (typeof src !== "object" || src === null) {
            clone = (Array.isArray(val) ? [] : {});
            target[key] = _this.deepExtend(clone, val);
            continue;
          }
          if (Array.isArray(val)) {
            clone = (Array.isArray(src) ? src : []);
          } else {
            clone = (!Array.isArray(src) ? src : {});
          }
          _results.push(target[key] = _this.deepExtend(clone, val));
        }
        return _results;
      };
    })(this));
    return target;
  }


  /*
    process exclusive click event and dblclick event
  */

  clicker(clickFunc, dblclickFunc, delay) {
    let clicks, timer;
    if (delay == null) {
      delay = 500;
    }
    clicks = 0;
    timer = null;
    return function() {
      let args;
      args = arguments;
      clicks += 1;
      if (clicks === 1) {
        return timer = setTimeout((function(_this) {
          return function() {
            clicks = 0;
            if (_.isFunction(clickFunc)) {
              return clickFunc.apply(_this, args);
            }
          };
        })(this), delay);
      } else {
        clicks = 0;
        clearTimeout(timer);
        if (_.isFunction(dblclickFunc)) {
          return dblclickFunc.apply(this, args);
        }
      }
    };
  }
}
