export default function($scope, $state, $ionicPopover, Settings) {

  $scope.sexObj = Settings.getSexObj();

  $scope.chooseSex = function(index) {
    Settings.setCurrenctSexIndex(index);
  };

  $scope.toSettings = () => {
    $state.go("tab.me-settings");
  };

}
