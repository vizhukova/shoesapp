export default function($scope, $state,  $ionicPopover, Settings, Brand, Item) {

  $scope.sexObj = Settings.getSexObj();

  $scope.ready = () => {
    return $scope.staticPages;
  };

  Settings.getStaticPage().then((data) => {

    $scope.staticPages = data;

  });

  $scope.toPromo = () => {
    $state.go("tab.me-settings-promo");
  };

  $scope.toShowMe = () => {
    $state.go("tab.me-settings-showMe");
  };

  $scope.toStaticPage = (id) => {
    $state.go("tab.me-static-page", {id: id});
  };

  $scope.signOut = () => {

    facebookConnectPlugin.logout(
      () => {
        console.success('Success facebook logout');
      }, () => {
       console.error('Error facebook logout');
      });

    Settings.signOut();
    $state.go("login");
    Brand.clearLikes();
    Item.clearLikes();
  }
}
