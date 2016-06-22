/// <reference path="../../../typings/globals/webpack-env/index.d.ts" />
declare var require:RequireFunction;
export default class RequireService {
  requireFolder(folder, regexp) {
    let req = require.context(folder , true, regexp);
    req.keys().forEach(function(key){
      req(key);
    });
  }
}
