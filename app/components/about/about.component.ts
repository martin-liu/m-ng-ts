import * as angular from 'angular';
import {Config} from '../../common/config.ts';
import {BaseComponent} from "../../common/base.component.ts";
import BasePageController from '../../common/base-page.controller.ts';

class AboutPage extends BaseComponent {
  public controller = class AboutPageController extends BasePageController {};
  public template = `
  <p>About<p>
  `;
}

angular
  .module(Config.name)
  .component('aboutPage', new AboutPage());
