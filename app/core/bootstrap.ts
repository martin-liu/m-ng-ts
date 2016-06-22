require('bootstrap-loader');
import {Config} from '../common/config.ts';

import '../lib/lib.scss';
import '../index.scss';
import './modules.ts';
import './services.ts';
import './components.ts';

angular.element(document).ready( () => {
   angular.bootstrap(document, [Config.name], {
       strictDi: true
   });
});
