declare var require:any;
export default class RequireService {
  static requireFolder(folder, regexp) {
    let req = require.context(folder , true, regexp);
    req.keys().forEach(req);
  }
}
