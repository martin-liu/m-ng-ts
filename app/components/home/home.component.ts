import './home.scss';

import * as angular from 'angular';
import {Config} from '../../common/config.ts';
import {BaseComponent} from "../../common/base.component.ts";
import BasePageController from '../../common/base-page.controller.ts';

export class HomePageController extends BasePageController {
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

    // highcharts
    this.bindHighcharts();

    // ajax call
    this.TestRemoteService.testMethod({a: 'test'})
      .then((data) => {
        console.log(data);
      }, (err) => {
        console.log(err)
      });
  }

  bindHighcharts(){
    this.data.chartConfig = {
      options: {
        //This is the Main Highcharts chart config. Any Highchart options are valid here.
        //will be overriden by values specified below.
        chart: {
          type: 'bar'
        },
        tooltip: {
          style: {
            padding: 10,
            fontWeight: 'bold'
          }
        }
      },
      //The below properties are watched separately for changes.

      //Series object (optional) - a list of series using normal Highcharts series options.
      series: [{
        data: [10, 15, 12, 8, 7]
      }]
    }
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
