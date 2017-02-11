/**
 * compatible ie ,ie >8
 */

let Promise;
declare var window;
export default Promise = window.Promise ? window.Promise : require('bluebird');