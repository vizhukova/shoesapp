import _ from 'lodash'

export default function($stateParams, $scope, $state, $ionicPopover, $ionicHistory, $sce, $cordovaSocialSharing, Brand, Category, Item) {

  $scope.animation = 'slide-in-up';
  $scope.chosenBrand = {};
  //$scope.categoryService = Category;
  $scope.cats = [];
  $scope.brands = [];

  var isDisableShare = false;

  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.ready = () => {
    return $scope.cats.length && $scope.brands.length && $scope.chosenBrand;
  };

  Category.get().then((data) => {
    $scope.cats = data;
    console.log('CATEGORIES', data)
  });

  Brand.getFiltered().then((brands) => {
    $scope.brands = brands;
  });

  Brand.getLiked().then((data) => {
    $scope.likedBrands = data;
    console.log('likedBrands', data)
  });

   if($stateParams.id) {

    Brand.get({id: $stateParams.id}).then((data) => {
      $scope.chosenBrand = data;
    }).catch((error) => {

    });

  }

  //$scope.$watch('categoryService.getActive()', (newVal, oldVal) => {
  //
  //  if(newVal && newVal.id) {
  //
  //    return Category.getArrayTree(newVal.id).then((cats) => {
  //      $scope.categoryTree = cats;
  //      console.log('categoryTree', cats)
  //      $scope.$digest();
  //    });
  //
  //  }
  //});

  $scope.goToBrand = (brand_id) => {

    $state.go("tab.brand", {id: brand_id});

  };

  $scope.toBrandProducts = (id) => {

    var brand_id = $stateParams.id || id;
    var category_id = $stateParams.id ? id : undefined;

    $state.go("tab.brand-products", {brandId: brand_id, sectionId: category_id});

  };


  //$scope.brandPopoverData = {
  //  name: 'Brand name',
  //  title: 'Title',
  //  description: 'description description description description',
  //  products: $scope.brandProducts
  //};

  var popups = [
    {name: 'brandPopover', url: 'src/brands/subtabs/brand-popover.html'},
    {name: 'moreInfo', url: 'src/brands/subtabs/more-info.html'}
  ];

  popups.map((popup)=>{
    $ionicPopover.fromTemplateUrl(popup.url, {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope[popup.name] = popover;
    });

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };
  })


  $scope.openbrandPopover = (brand_id) => {
    Brand.getProducts({id:brand_id}).then((brand) => {
      $scope.chosenBrand = brand;
      $scope.brandPopover.show();
      console.log('$scope.chosenBrand', $scope.chosenBrand)
    });
  }

  $scope.opensubtabShowcase = () => {
    $scope.subtabShowcase.show();
  }

  $scope.openmoreInfo = (e) => {
    e.stopPropagation();
    $scope.moreInfo.show();
  }

  $scope.isCategoryChosen = (index) => {
    return $scope.categories[index].chosen;
  };

  $scope.setCategoryChosen = (index) => {
    $scope.categories.map((item) => item.chosen = false);
    $scope.categories[index].chosen = true;
  };

  $scope.followFormMoreInfo = () => {
    $scope.follow( $scope.chosenBrand );
    $scope.moreInfo.hide();
  }


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

  $scope.follow = (brand) => {

    if(brand.isLiked) {

      Brand.removeLiked(brand.id);
      brand.isLiked = false;

    } else {

      Brand.addLiked(brand.id);
       brand.isLiked = true;

    }
  };

  //$scope.update = () => {
  //
  //  Brand.saveInLocalStorage($scope.chosenBrands);
  //
  //};

  $scope.isSelected = (index) => _.indexOf($scope.chosenBrands, index) !== -1

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

  $scope.shareAnywhere = function() {

    if(isDisableShare) return;

    isDisableShare = true;

                              /*socialType, message, image, link*/
    $cordovaSocialSharing.share('', $scope.chosenBrand.name, $scope.chosenBrand.background, $scope.chosenBrand.url).then(() => {
      isDisableShare = false;
    }).catch((err) => {
      isDisableShare = false;
    })
  }

}
