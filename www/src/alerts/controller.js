export default function($stateParams, $scope, $state, $ionicPopover, $sce, Brand, Category, Alert) {

  //$scope.products = [1, 2, 3,4 ,5 ,6, 7, 8,9, 0];

  $scope.goToAlerts = () => {
    $state.go('tab.alerts');
  };

  $scope.goToAlert = (brand_id) => {
    $state.go('tab.brand', {id: brand_id});
  };

  Category.get().then((data) => {

    $scope.cats = data;

  });

  Alert.get().then((data) => {

    $scope.alerts = data;

  });

}
