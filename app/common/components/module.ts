import {Config} from '../config.ts';
import LoadingComponent from './loading.component.ts';
import FullscreenComponent from './fullscreen.component.ts';
import GradientComponent from './gradient.component.ts';

angular.module(Config.name)
  .component('mFullscreen', new FullscreenComponent())
  .component('mGradient', new GradientComponent())
  .component('mLoading', new LoadingComponent());
