import * as angular from 'angular';
import * as uiBootstrap from 'angular-ui-bootstrap';
const ngSanitize = require('angular-sanitize');
import * as _ from 'lodash';
import {Config} from '../common/config.ts';
import BootstrapService from '../common/services/bootstrap.service.ts';
import Cache from '../common/services/cache.service.ts';
import './config.ts';
import 'restangular';
declare var locache:any;

angular.module(Config.name, [ngSanitize, 'config', uiBootstrap, 'restangular'])
  .constant('Cache', Cache)
  .constant('_', _)
  .config(($provide, $httpProvider, RestangularProvider) => {
    // Restangular base url
    RestangularProvider.setBaseUrl(Config.uri.api);

    // Global http error handler
    $httpProvider.interceptors.push( ($timeout, $q, $rootScope, $location) => {
      return {
        request : (config) => {
          return config || $q.when(config)
        },
        responseError : (response) => {
          if (response.data && response.data.message){
            let tplErrorHandler = require('../common/partials/error_handler.html');
            $rootScope.Util.createDialog(tplErrorHandler, {message: response.data.message}, angular.noop)
          }
          return $q.reject(response);
        }
      };
    });
  })
  .run( (AppInitService) => {
    BootstrapService.resolve();
    AppInitService.init();
  });
