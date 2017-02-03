import './core/bootstrap';
import 'angular-mocks';
require('es6-promise').polyfill();

console.log(Promise)

// require from current directory and all subdirectories
let testsContext = require.context(".", true, /spec.ts$/);
testsContext.keys().forEach(testsContext);
