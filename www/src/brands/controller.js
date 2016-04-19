import _ from 'lodash'

export default function($scope, $state, $ionicPopover, $sce, Brand) {

  $scope.chosenBrands = [];
  $scope.brands = Brand.get();
  $scope.products = Brand.getProducts();

  $scope.widget = {
    title: 'On sale',
    subtitle: 'Subtitle',
    postheader: 'Recomended for you',
    sale: true,
    items: $scope.products
  }

  $scope.onBlindChange = (index) => {

    if( _.indexOf($scope.chosenBrands, index) == -1 ) {

      $scope.chosenBrands.push(index);

    } else {

      $scope.chosenBrands = _.filter($scope.chosenBrands, (item) => item != index);

    }

  };

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  $scope.toBrand = () => {

    $state.go("tab.brand");

  };

  $scope.update = () => {

    Brand.saveInLocalStorage($scope.chosenBrands);

  };

  $scope.isSelected = (index) => _.indexOf($scope.chosenBrands, index) !== -1
}
