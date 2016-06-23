import '../common/services/module.ts';

declare var require:any;
let req = require.context('../services', true, /^.*\.service\.ts$/igm);
req.keys().forEach(req);
