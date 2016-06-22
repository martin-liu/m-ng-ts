import {Config} from '../common/config.ts';
import '../common/services/module.ts';
import TestRemoteService from '../services/remote/test.service.ts';

angular.module(Config.name)
  .service('TestRemoteService', TestRemoteService);
