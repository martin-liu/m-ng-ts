import {BaseComponent} from "../base.component.ts";
import BindingType from "../binding-types.ts";
import DomService from "../services/dom.service.ts";

/***
    @ngdoc directive
    @name m-directive.directive:mFullscreen
    @element div
    @restrict A
    @description This directive is used to toggle fullscreen on an element
    @example
    <example module="eg">
    <file name="index.js">
    angular.module('eg',['m-directive'])
    .controller('EgCtrl', ['$scope', function($scope){
    }]);
    </file>
    <file name="index.html">
    <div ng-controller="EgCtrl">
    <div m-fullscreen style="border: solid 1px">
    <button class="btn btn-primary"
    type="button" data-toggle="m-fullscreen"></button>
    </div>
    </div>
    </file>
    </example>
*/
class FullscreenController {
  static $inject = ['$scope', '$element'];
  constructor(private $scope, private $element){}

  $postLink() {
    let toggleEl = DomService.findChild(this.$element[0], (d) => {
      return 'm-fullscreen' == angular.element(d).attr('data-toggle');
    });
    if (toggleEl){
      toggleEl = angular.element(toggleEl);
      toggleEl.attr('style', 'cursor:sw-resize');
      toggleEl.bind('click', ()=> {
        angular.element(document.body).toggleClass('fullscreenStatic');
        this.$element.toggleClass('fullscreen');
      });
      // Prevent memory leak
      this.$scope.$on('$destroy', () => toggleEl.unbind('click'));
    }
  }
}

export default class FullscreenComponent extends BaseComponent {

  public transclude = true;
  public template = "<ng-transclude></ng-transclude>";

  public controller = FullscreenController;
}
