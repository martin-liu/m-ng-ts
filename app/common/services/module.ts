import * as angular from 'angular';
import {Config} from '../config.ts';
import AppInitService from '../services/app-init.service.ts';
import Util from '../services/util.service.ts';

angular.module(Config.name)
  .service('AppInitService', AppInitService)
  .service('Util', Util);
