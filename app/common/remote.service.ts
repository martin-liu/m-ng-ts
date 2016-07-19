import {Config} from './config.ts';

export default class BaseRemoteService {
  static $inject = ['Restangular', 'Util', '$q', '$timeout'];
  protected rest;

  constructor(protected Restangular, protected Util, protected $q, protected $timeout){
    this.rest = this.getRest(Restangular);
  }

  protected getRest(Restangular){
    return Restangular.all('');
  }

  private getCacheKey(method, param) {
    let classMatch = /function\s+(\w+)\(.*\).*/.exec(this.constructor.toString());
    let className;
    if (classMatch.length == 2) {
      className = classMatch[1];
    }
    return `${Config.name}_${className}_${method}_${JSON.stringify(param)}`;
  }

  // Session cache
  getWithCache(method, param, func, timeout = 300) {
    this.Util.getWithCache(this.getCacheKey(method, param), true, func, timeout);
  }

  doQuery(method, param, canceler?) {
    if (canceler && canceler.promise) {
      let config = {timeout: canceler.promise};
      return this.rest.one(method).withHttpConfig(config).get(param);
    } else {
      return this.rest.one(method).get(param);
    }
  }

  doQueryWithCache(method, param, canceler = null, timeout = 300){
    this.getWithCache(method, param, () => {
      if (canceler && canceler.promise) {
        let config = {timeout: canceler.promise};
        return this.rest.one(method).withHttpConfig(config).get(param);
      } else {
        return this.rest.one(method).get(param);
      }
    }, timeout);
  }

  mockResult(data, time = 1000){
    let defer = this.$q.defer();
    this.$timeout(()=> {
      defer.resolve(data);
    }, time);

    return defer.promise;
  }
}
