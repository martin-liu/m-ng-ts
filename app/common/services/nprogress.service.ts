const NProgress = require('nprogress');

export default new class NProgressService {
  start() {
    if ("undefined" != typeof NProgress){
      NProgress.start();
    }
  }
  done() {
    if ("undefined" != typeof NProgress){
      setTimeout(()=> NProgress.done(), 1000);
    }
  }
}
