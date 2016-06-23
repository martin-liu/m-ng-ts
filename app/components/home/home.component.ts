import './home.scss';

import {Config} from '../../common/config.ts';
import {BaseComponent} from "../../common/base.component.ts";
import BasePageController from '../../common/base-page.controller.ts';

class HomePageController extends BasePageController {
  static $inject = ['$timeout', 'TestRemoteService'];
  constructor(private $timeout, private TestRemoteService){
    super()
  }

  bindView(){
    this.data.num = 1;
    this.$timeout(()=>{
      this.state.dataLoaded = true;
      this.data.test = 'this is a test';
    }, 2000);

    this.TestRemoteService.testMethod({a: 'haha'})
      .then((data) => {
        console.log(data);
      }, (err) => {
        console.log(err)
      });
  }

  doSomething(){
    this.data.num += 1;
  }
}

class HomePage extends BaseComponent {
  public controller = HomePageController;
  public template = require('./home.html');
}

angular
  .module(Config.name)
  .component('homePage', new HomePage());
