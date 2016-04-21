import _ from 'lodash'

export default function($scope, $state, $ionicPopover, $sce, Brand) {

  $scope.animation = 'slide-in-up';
  $scope.chosenBrands = [];
  $scope.brands = Brand.get();
  $scope.products = Brand.getProducts();
  $scope.brandProducts = Brand.getBrandProducts();

  $scope.goToBrand = () => {
     $state.go("tab.brand");
  };

  $scope.test = 'test';

  $scope.widget = {
    title: 'On sale',
    subtitle: 'Subtitle',
    postheader: 'Recomended for you',
    sale: true,
    items: $scope.products
  };

  $scope.brandPopoverData = {
    name: 'Brand name',
    title: 'Title',
    description: 'description description description description',
    products: $scope.brandProducts
  };

  $scope.categories = ['Dresses', 'Tops', 'All Women'];

  var popups = [
    {name: 'brandPopover', url: 'src/brands/subtabs/brand-popover.html'},
    {name: 'subtabShowcase', url: 'templates/subtab-showcase.html'},
    {name: 'brandItem', url: 'src/brands/subtabs/brand-item.html'}
  ];

  popups.map((popup)=>{
    $ionicPopover.fromTemplateUrl(popup.url, {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope[popup.name] = popover;
    });

    $scope[`open${popup.name}`] = ()=>{
      $scope[popup.name].show();
    };

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };
  })

  $scope.toBrandProducts = () => {

    //$scope.popover.hide();
    $state.go("tab.brand-products")

  };

  $scope.isCategoryChosen = (index) => {
    return $scope.categories[index].chosen;
  };

  $scope.setCategoryChosen = (index) => {
    $scope.categories.map((item) => item.chosen = false);
    $scope.categories[index].chosen = true;
  };


  $scope.onBlindChange = (index) => {

    if( _.indexOf($scope.chosenBrands, index) == -1 ) {

      $scope.chosenBrands.push(index);

    } else {

      $scope.chosenBrands = _.filter($scope.chosenBrands, (item) => item != index);

    }

  };

  $scope.update = () => {

    Brand.saveInLocalStorage($scope.chosenBrands);

  };

  $scope.isSelected = (index) => _.indexOf($scope.chosenBrands, index) !== -1
}
