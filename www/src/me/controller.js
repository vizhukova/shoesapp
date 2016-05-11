export default function($scope, $state, Item, Brand) {

  Item.getLiked().then((data) => {
    $scope.likedProducts = data;
  });

  Brand.getLiked().then((data) => {
    $scope.likedBrands = data;
    console.log(data)
  });


  $scope.toOrders = () => {
      $state.go("tab.me-orders");
  };

  $scope.toBrands = () => {
      $state.go("tab.me-brands");
  };

  $scope.toSettings = () => {
      $state.go("tab.me-settings");
  };

}
