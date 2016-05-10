import _ from 'lodash'

export default function($stateParams, $scope, $state, $ionicPopover, $sce, Brand, Category, Item) {

  $scope.animation = 'slide-in-up';
  $scope.chosenBrands = [];
  $scope.chosenBrand = {};

  Category.get().then((data) => {
    $scope.cats = data;
    $scope.chosenCategorId = data[0].id;
  });

  Brand.get().then((data) => {
    $scope.products = data;
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

  Brand.getLiked().then((data) => {
    $scope.likedBrands = data;
    console.log('likedBrands', data)
  });

  console.log('$stateParams', $stateParams);

   if($stateParams.id) {

    Brand.get({id: $stateParams.id}).then((data) => {
      $scope.chosenBrand = data;
    });

  }


  $scope.goToBrand = (brand_id) => {

    $state.go("tab.brand", {id: brand_id});

  };

  $scope.toBrandProducts = (id) => {

    var brand_id = $stateParams.id || id;
    var category_id = $stateParams.id ? id : undefined;

    $state.go("tab.brand-products", {brandId: brand_id, sectionId: category_id});

  };


  $scope.brandPopoverData = {
    name: 'Brand name',
    title: 'Title',
    description: 'description description description description',
    products: $scope.brandProducts
  };

  //var popups = [
  //  {name: 'brandPopover', url: 'src/brands/subtabs/brand-popover.html'},
  //  {name: 'subtabShowcase', url: 'templates/subtab-showcase.html'},
  //  {name: 'moreInfo', url: 'src/brands/subtabs/more-info.html'}
  //];
  //
  //popups.map((popup)=>{
  //  $ionicPopover.fromTemplateUrl(popup.url, {
  //    scope: $scope,
  //    animation: $scope.animation
  //  }).then((popover)=>{
  //    $scope[popup.name] = popover;
  //  });
  //
  //  $scope.trustSrc = function(src) {
  //    return $sce.trustAsResourceUrl(src);
  //  };
  //})


  $scope.openbrandPopover = (brand_id) => {
    Brand.getProducts({id:brand_id}).then((products) => {
      $scope.chosenBrand = products;
      $scope.brandPopover.show();
      console.log('$scope.chosenBrand', $scope.chosenBrand)
    });
  }

  //$scope.opensubtabShowcase = () => {
  //  $scope.subtabShowcase.show();
  //}
  //
  //$scope.openmoreInfo = () => {
  //  $scope.moreInfo.show();
  //}

  $scope.goToBrandFollowPage = () => {
    $state.go("tab.brand-follow")
  };

  //$scope.isCategoryChosen = (index) => {
  //  return $scope.categories[index].chosen;
  //};

  //$scope.setCategoryChosen = (index) => {
  //  $scope.categories.map((item) => item.chosen = false);
  //  $scope.categories[index].chosen = true;
  //};


  //$scope.onBlindChange = (index) => {
  //
  //  if( _.indexOf($scope.chosenBrands, index) == -1 ) {
  //
  //    $scope.chosenBrands.push(index);
  //
  //  } else {
  //
  //    $scope.chosenBrands = _.filter($scope.chosenBrands, (item) => item != index);
  //
  //  }
  //
  //};

  //$scope.follow = (brand) => {
  //
  //  if(brand.isLiked) {
  //
  //    Brand.removeLiked(brand.id);
  //    brand.isLiked = false;
  //
  //  } else {
  //
  //    Brand.addLiked(brand.id);
  //     brand.isLiked = true;
  //
  //  }
  //};

  //$scope.update = () => {
  //
  //  Brand.saveInLocalStorage($scope.chosenBrands);
  //
  //};

  //$scope.isSelected = (index) => _.indexOf($scope.chosenBrands, index) !== -1
  //
  //$scope.filter = function(params) {
  //
  //  if($stateParams.id) params.brandId = $stateParams.id;
  //
  //  Item.getFiltered(params).then((data) => {
  //
  //    $scope.products = data;
  //
  //  });
  //}

}
