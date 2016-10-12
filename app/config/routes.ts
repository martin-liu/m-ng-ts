export const routes:Array<Object> = [
  // parts of this object will register route as `$routeProvider.when(url, params)`
  {
    url: "/",
    component: 'homePage',     // directive name
    params: {
      name: "home",
      trackingName: "home_page",         // this is used for piwik tracking, if not specificed, then piwik will use `name`
      label: "Home"
    }
  },
  {
    url: "/about",
    component: 'aboutPage',
    params: {
      name: "about",
      label: "About Us"
    }
  }
];
