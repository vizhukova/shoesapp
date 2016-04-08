export default function($scope, $state, $ionicPopover) {

  $scope.toBrand = () => {
    $state.go("tab.brand")
  }
}
