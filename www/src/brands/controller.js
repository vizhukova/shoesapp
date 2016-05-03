import _ from 'lodash'

export default function($stateParams, $scope, $state, $ionicPopover, $sce, Brand, Category) {

  $scope.animation = 'slide-in-up';
  $scope.chosenBrands = [];
  $scope.chosenBrand = {};


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

  Brand.getSales().then((data) => {
     $scope.brandSales = data;
  });

  Brand.getNewArrivals().then((data) => {
     $scope.newArrivals = data;
  });


  if($stateParams) {

    console.log('$stateParams', $stateParams)

    if($stateParams.id && $stateParams.categoryId) {

       Brand.getItems({brandFilter: {id: $stateParams.id}, itemFilter: {sectionId: $stateParams.categoryId, brandId: $stateParams.id}}).then((data) => {
        $scope.chosenBrand = data;
         console.log('!!!!', data)
      });

    }

    else if($stateParams.id) {

      Brand.get({id: $stateParams.id}).then((data) => {
        $scope.chosenBrand = data;
      });

    }
  }


  $scope.goToBrand = (brand_id) => {

    $state.go("tab.brand", {id: brand_id});

  };

  $scope.toBrandProducts = (category_id) => {

    $state.go("tab.brand-products", {id: $stateParams.id, categoryId: category_id})

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
