export default function($scope, $state) {


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
