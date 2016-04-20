import _ from 'lodash'

export default function($scope, $state, $ionicPopover, $sce, Brand) {

  $scope.animation = 'slide-in-up';
  $scope.chosenBrands = [];
  $scope.brands = Brand.get();
  $scope.products = Brand.getProducts();
  $scope.brandProducts = Brand.getBrandProducts();

  $scope.widget = {
    title: 'On sale',
    subtitle: 'Subtitle',
    postheader: 'Recomended for you',
    sale: true,
    items: $scope.products
  };

  $scope.brandPopover = {
    name: 'Brand name',
    title: 'Title',
    description: 'description description description description',
    products: $scope.brandProducts
  };

  $scope.onBlindChange = (index) => {

    if( _.indexOf($scope.chosenBrands, index) == -1 ) {

      $scope.chosenBrands.push(index);

    } else {

      $scope.chosenBrands = _.filter($scope.chosenBrands, (item) => item != index);

    }

  };

   $ionicPopover.fromTemplateUrl('src/brands/subtabs/brand-popover.html', {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope.popover = popover;
    });

    $scope.openPopover = ($event)=>{
      $scope.popover.show($event);
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
