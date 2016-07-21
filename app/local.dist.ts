module.exports = (app) => {
  app.run(($rootScope) => {
    var user = {
      nt : 'hualiu',
      firstName : 'Martin',
      lastName : 'Liu',
      displayName : 'Liu, Martin',
      label : 'Liu, Martin(hualiu)'
    };
    $rootScope.user = user;
  });
}
