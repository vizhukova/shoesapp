import _ from 'lodash'

export default function($stateParams, $scope, $state, $ionicPopover, $sce, Brand, Category) {

  $scope.animation = 'slide-in-up';
  $scope.chosenBrands = [];

  console.log('$stateParams', $stateParams);

  Category.get().then((data) => {
    $scope.cats = data;
  });

  Brand.get().then((data) => {
    $scope.products = data;
  });

  Brand.get().then((data) => {
    $scope.brandProducts = data;
  });

  Brand.getFiltered().then((brands) => {
    $scope.brands = brands;
  });

  Brand.getFiltered({feature: 'new'}).then((brands) => {
    $scope.brandsNew = brands;
  });

  Brand.getFiltered({feature: 'sales'}).then((brands) => {
    $scope.brandsSales = brands;
  });

  Brand.getFiltered({feature: 'popular'}).then((brands) => {
    $scope.brandsPopular = brands;
  });

  if($stateParams) {
     Brand.get({id: $stateParams.id}).then((data) => {

       $scope.chosenBrand = data;

    });
  }


  $scope.goToBrand = (brand_id) => {

    $state.go("tab.brand", {id: brand_id});

  };

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

  var popups = [
    {name: 'brandPopover', url: 'src/brands/subtabs/brand-popover.html'},
    {name: 'subtabShowcase', url: 'templates/subtab-showcase.html'},
    {name: 'moreInfo', url: 'src/brands/subtabs/more-info.html'}
  ];

  popups.map((popup)=>{
    $ionicPopover.fromTemplateUrl(popup.url, {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope[popup.name] = popover;
    });

    /*$scope[`open${popup.name}`] = ()=>{

      $scope[popup.name].show();
    };*/

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };
  })

  $scope.openbrandPopover = (brand_id) => {
    Brand.getProducts({id:brand_id}).then((products) => {
      $scope.chosenBrand = products;
      $scope.brandPopover.show();
      console.log('$scope.chosenBrand', $scope.chosenBrand)
    });
  }

  $scope.opensubtabShowcase = () => {
    $scope.subtabShowcase.show();
  }

  $scope.openmoreInfo = () => {
    $scope.moreInfo.show();
  }

  $scope.toBrandProducts = () => {

    $state.go("tab.brand-products")

  };

  $scope.goToBrandFollowPage = () => {
    $state.go("tab.brand-follow")
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
