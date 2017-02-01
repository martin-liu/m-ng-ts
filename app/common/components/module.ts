import * as angular from 'angular';
import {Config} from '../config.ts';
import LoadingComponent from './loading.component.ts';
import FullscreenComponent from './fullscreen.component.ts';
import GradientComponent from './gradient.component.ts';
import HeaderComponent from './header.component.ts';

angular.module(Config.name)
  .component('mFullscreen', new FullscreenComponent())
  .component('mGradient', new GradientComponent())
  .component('mHeader', new HeaderComponent())
  .component('mLoading', new LoadingComponent());
