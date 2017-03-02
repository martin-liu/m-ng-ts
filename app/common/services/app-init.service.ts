import * as angular from 'angular';
import * as _ from 'lodash';
import IntroService from './intro.service.ts';

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

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

  private saveUser(user) {
    let nt = user.nt;
    let email = user.email;
    let firstName = user.firstName;
    let lastName = user.lastName;
    let displayName = lastName + ', ' + firstName;

    if (nt) {
      let user = {
        nt, firstName, lastName, email, displayName,
        label : displayName + '(' + nt + ')'
      }
      this.$rootScope.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  public initUser() {
    this.$rootScope.user = angular.fromJson(localStorage.getItem('user'));
    let defer = this.$q.defer();
    if (!this.$rootScope.user && this.Config.PFSSO && this.Config.PFSSO.enabled) {
      this.$http({
        method: 'GET',
        url: document.location.href + '?t=' + new Date().getTime() // in case returning 304
      }).then((res) => {
        let user = {
          nt : res.headers('PF_AUTH_SUBJECT'),
          email : res.headers('PF_AUTH_EMAIL'),
          firstName : res.headers('PF_AUTH_FIRST'),
          lastName : res.headers('PF_AUTH_LAST')
        };
        this.saveUser(user);

        return defer.resolve();
      }, (e) => defer.resolve());
    } else {
      defer.resolve();
    }

    defer.promise.then(() => {
      // read cookie if not get user info
      if (!this.$rootScope.user || !this.$rootScope.user.nt) {
        let nt = getCookie('ntlogin');
        if (nt) {
          let user = {
            nt,
            firstName : getCookie('firstname'),
            lastName : getCookie('lastname')
          };

          this.saveUser(user);
        }
      }
    });
    return defer.promise;
  }

  public setupPersistence (obj, cache) {
    let defer = this.$q.defer();
    this.promises.push(defer.promise);
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
      this.$rootScope.currentPageTrackingName = current.trackingName;
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
