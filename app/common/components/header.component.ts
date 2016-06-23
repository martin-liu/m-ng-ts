import {BaseComponent} from "../base.component.ts";
import BindingType from "../binding-types.ts";

class HeaderController {
  static $inject = ['$rootScope', 'Util', 'Config'];
  constructor(private $rootScope, private Util, private Config){}
}

const binding:{[bindngs: string]: string} = {
  mailto: BindingType.VALUE,
  wiki: BindingType.VALUE
};

export default class GradientComponent extends BaseComponent {

  public bindings = binding;
  public controller = HeaderController;

  public template = `
    <div headroom intro-step="2" style="min-height:45px"
         class="navbar navbar-inverse navbar-fixed-top animated slideInDown">
      <div class="navbar-inner">
        <div class="container-fluid">
          <a class="navbar-brand" style="color:#fff">
            {{vm.Config.title}}
          </a>
          <ul class="nav navbar-nav">
            <li class="float-shadow"
                ng-class="{active: vm.$rootScope.currentPage == route.params.name}"
                ng-click="vm.Util.redirect(route.url)"
                ng-repeat="route in vm.Config.routes">
              <a href="" ng-bind="route.params.label"></a>
            </li>
          </ul>
          <div class="nav nav-pills pull-right" style="margin-right:20px">
            <li>
              <a style="color: #999" ng-href="{{vm.mailto}}">
                <i class="fa fa-envelope"></i></a>
            </li>
            <li>
              <a style="color: #999" ng-href="{{vm.wiki}}" target="_blank">
                <i class="fa fa-question-circle"></i>
              </a>
            </li>
            <li ng-if="vm.Config.intro.enabled">
              <a style="color: #999" href="" target="_blank" ng-click="vm.$rootScope.startIntro()">
                Tour
              </a>
            </li>
          </div>
        </div>
      </div>
    </div>
    `;
}
