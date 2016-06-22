import BaseRemoteService from '../../common/remote.service.ts';

export default class TestRemoteService extends BaseRemoteService {
  getRest(Restangular) {
    return Restangular.all('test');
  }

  testMethod(param) {
    return this.doQuery('test', param);
  }

  testWithCache(param, timeout = 300) {
    return this.doQueryWithCache('test', param, null, timeout);
  }
}
