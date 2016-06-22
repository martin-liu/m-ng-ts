import {Config} from '../config.ts';
declare var Piwik:any;

export default new class PiwikService {
  public init(username, pagename) {
    if ("undefined" != typeof Piwik) {
      let siteId = Config.piwik.siteId;
      let pkBaseURL = Config.piwik.url;
      let app = Config.piwik.app;
      let prod = Config.piwik.prod;
      let piwikTracker = Piwik.getTracker("#{pkBaseURL}/piwik.php", siteId);
      piwikTracker.setCustomVariable(1, "User", username, "visit");
      piwikTracker.setCustomVariable(2, "App", app, "page");
      piwikTracker.setCustomVariable(3, "PageName", pagename, "page");
      piwikTracker.setCustomVariable(4, "Prod", prod, "page");
      piwikTracker.trackPageView();
      piwikTracker.enableLinkTracking();
    }
  }
}
