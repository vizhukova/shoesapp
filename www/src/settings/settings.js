export default function($scope, $state,  $ionicPopover) {

  $scope.toPromo = () => {
    $state.go("tab.me-settings-promo");
  }

}
