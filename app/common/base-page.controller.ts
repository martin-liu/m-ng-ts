import * as angular from 'angular';
import {Config} from './config.ts';
import PiwikService from './services/piwik.service.ts';
import IntroService from './services/intro.service.ts';
import NProgressService from './services/nprogress.service.ts';
import BootstrapService from './services/bootstrap.service.ts';

export default class BasePageController {
  state: any;
  data: any;
  actions: any;

  constructor(){
    this.state = {};
    this.data = {};
    this.actions = this.bindAction();

    BootstrapService.promise.then( () => {
      let $injector = angular.element(document).injector();
      let $rootScope = $injector.get('$rootScope');
      let AppInitService:any = $injector.get('AppInitService');
      // Bind viewModel to view after page init
      AppInitService.done().then(()=> {
        this.pageInit($rootScope).then( () => {
          $rootScope.$apply(()=> this.bindView());
        });
        if (Config.debug == true){
          window['vm'] = this;
          window['rootScope'] = $rootScope;
        }
      });
    });
  }

  initialize() {
    return new Promise((resolve) => resolve());
  }

  bindView(){}
  bindAction(){}

  pageInit($scope){
    return new Promise( (resolve) => {
      NProgressService.start();
      this.initialize().then(()=>{
        NProgressService.done();
        // Intro
        if (Config.intro.enabled) {
          IntroService.init();
        }
        // Piwik
        if (Config.piwik.enabled && $scope.user) {
          PiwikService.init($scope.user.nt, $scope.currentPage);
        }
        resolve();
      });
    });
  }
}
