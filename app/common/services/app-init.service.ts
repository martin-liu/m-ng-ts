import * as _ from 'lodash';
import IntroService from './intro.service.ts';

export default class AppInitService {
  static $inject = ['$rootScope', '$window', '$http', '$q', 'Util', 'Config', 'Cache', 'Constant'];
  promises: Array<any>;

  constructor(private $rootScope:any,
              private $window:any,
              private $http:any,
              private $q:any,
              private Util:any,
              private Config:any,
              private Cache:any,
              private Constant:any) {
    this.promises = [];
  }

  public initUser() {
    this.$rootScope.user = angular.fromJson(localStorage.getItem('user'));
    let defer = this.$q.defer();
    if (!this.$rootScope.user && this.Config.PFSSO && this.Config.PFSSO.enabled) {
      this.$http({
        method: 'GET',
        url: document.location.href
      }).then((res) => {
        let nt = res.headers('PF_AUTH_SUBJECT');
        let email = res.headers('PF_AUTH_EMAIL');
        let firstName = res.headers('PF_AUTH_FIRST');
        let lastName = res.headers('PF_AUTH_LAST');
        let displayName = lastName + ', ' + firstName;

        if (nt) {
          let user ={
            nt, firstName, lastName, email, displayName,
            label : displayName + '(' + nt + ')'
          }
          this.$rootScope.user = user;
          localStorage.setItem('user', JSON.stringify(user));
        }
        return defer.resolve();
      });
    } else {
      defer.resolve()
    }
    return defer.promise
  }

  public setupPersistence (obj, cache) {
    let defer = this.$q.defer();
    this.promises.push(defer);
    // Wach to persist object in local/session storage
    this.$rootScope.$watch(()=>{
      // use angular.toJson to remove internal properties like $$hashKey
      return angular.toJson(obj);
    }, (newVal, oldVal) => {
      let key = 'persistent_object';
      if (newVal == oldVal){     // initial
        angular.extend(obj, cache.get(key));
        defer.resolve();
      } else {
        cache.set(key, JSON.parse(newVal));
      }
    } , true);                    // equal
  }

  public init(){
    this.$rootScope.$on('$routeChangeSuccess', ($event, current) => {
      this.$rootScope.currentPage = current.name;
    });

    this.$rootScope.Util = this.Util;

    this.$rootScope.config = this.Config;

    this.add(this.initUser());

    this.$rootScope.dict = {
      get : (key) => {
        key = _.trim(key);
        let ret = this.Constant.dict[key] || key;
        return ret;
      }
    }

    this.$rootScope.startIntro = () => IntroService.start();

    this.$rootScope.persistence = {};
    this.$rootScope.session = {};
    this.setupPersistence(this.$rootScope.persistence, this.Cache);
    this.setupPersistence(this.$rootScope.session, this.Cache.session);
  }

  public add(promise) {
    return this.promises.push(promise);
  }

  public done() {
    return this.$q.all(this.promises);
  }
}
