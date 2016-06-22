import * as angular from 'angular';
import * as ngRoute from 'angular-route';
import * as _ from 'lodash';
import {Config, Constant} from '../common/config.ts';

angular.module("config", [ngRoute])
  .constant('Config', Config)
  .constant('Constant', Constant)
  .config( ($routeProvider, $locationProvider, $logProvider) => {
    // Set debug to true by default.
    if ((angular.isUndefined(Config.debug)) || Config.debug != false) {
      Config.debug = true
    }

    // Disable logging if debug is off.
    if (!Config.debug) {
      $logProvider.debugEnabled(false);
    }

    // Loop over routes and add to router.
    angular.forEach(Config.routes, (route) => {
      if (route.component) {
        // convert `ngModel` style to `ng-model` style
        let tag = route.component.replace(/([A-Z])/g, '-$1').toLowerCase();
        tag = _.trim(tag, '-');
        route.params.template = `<${tag}></${tag}>`;
      }
      $routeProvider.when(route.url, route.params);
    });
    // Otherwise
    $routeProvider.otherwise({
      template: require('../common/partials/404.html')
    })

    // Set to use HTML5 mode, which removes the #! from modern browsers.
    // Only when config it and browser support HTML5 history API
    let isHtml5Mode = !!Config.urlHtml5Mode && (window.history && 'pushState' in window.history);
    $locationProvider.html5Mode(isHtml5Mode);
    $locationProvider.hashPrefix('!');
  });
