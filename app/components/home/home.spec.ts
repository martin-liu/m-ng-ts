import {expect, assert} from 'chai';
import {Config} from '../../common/config';
const sinon = require('sinon');
const { suite, test, slow, timeout, skip, only } = require("mocha-typescript");
import * as angular from 'angular';

import {HomePageController} from './home.component';

@suite("Test HomeComponent")
class TestHomeComponent {
  private vm:any;
  private vmSpy:any;

  constructor() {
  }

  // instance before/after will be called before/after each test
  before() {
    angular.mock.module(Config.name);
    angular.mock.inject(($rootScope, $controller, $timeout, TestRemoteService) => {
      let scope = $rootScope.$new();

      this.vm = new HomePageController($timeout, TestRemoteService);
    })
  }

  after() {
  }

  // static before/after will be called before/after all tests
  static before() {
  }

  @test("should pass")
  testTest() {
    let spy = sinon.spy(this.vm, 'bindView');
    assert(spy.calledOnce);
    spy.restore();
  }

}
