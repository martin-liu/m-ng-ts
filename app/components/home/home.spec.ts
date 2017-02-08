import {expect, assert} from 'chai';
import {Config} from '../../common/config';
const sinon = require('sinon');
const { suite, test, slow, timeout, skip, only } = require("mocha-typescript");
import * as angular from 'angular';

import {HomePageController} from './home.component';

@suite("Test HomeComponent")
class TestHomeComponent {
  private vm:any;

  constructor() {
  }

  // static before/after will be called before/after all tests
  static before() {
  }

  // instance before/after will be called before/after each test
  before() {
    angular.mock.module(Config.name);
    return new Promise((rs) => {
      angular.mock.inject(($rootScope, $controller, $timeout, TestRemoteService) => {
        let scope = $rootScope.$new();

        this.vm = new HomePageController($timeout, TestRemoteService);

        // wait 1 second to ensure vm rendered
        setTimeout(rs, 1000)
      });
    })
  }

  after() {
  }

  @test("bindView testing")
  testBindView() {
    expect(this.vm.data.num).to.equal(1);
  }

  @test("doSomething")
  testDoSomething() {
    this.vm.doSomething();
    expect(this.vm.data.num).to.equal(2);
  }

}
