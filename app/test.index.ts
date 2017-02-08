require('es6-promise').polyfill();
import './core/bootstrap';
import 'angular-mocks';

// require from current directory and all subdirectories
let testsContext = require.context(".", true, /spec.ts$/);
testsContext.keys().forEach(testsContext);
