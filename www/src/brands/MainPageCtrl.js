import _ from 'lodash'

export default function($stateParams, $scope, $state, $ionicPopover, $sce, Brand, Category, Item) {

  $scope.animation = 'slide-in-up';
  $scope.chosenBrands = []; //выбор бредов на главной страницы для подписки, если нет ни одного бренда, на который подписан пользователь
  $scope.chosenBrand = {};

   console.log('$stateParams', $stateParams);

  // if($stateParams.id) {
  //
  //  Brand.get({id: $stateParams.id}).then((data) => {
  //    $scope.chosenBrand = data;
  //  });
  //
  //}


  Category.get().then((data) => {
    $scope.cats = data;
    $scope.chosenCategorId = data[0].id;
  });

  //Brand.get().then((data) => {
  //  $scope.products = data;
  //});

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
    $scope.$digest();

    console.log('likedBrands', data)
  });

  $scope.goToBrand = (brand_id) => {

    $state.go("tab.brand", {id: brand_id});

  };

  $scope.toBrandProducts = (id, params) => {

    var brand_id = $stateParams.id || id;
    //var category_id = $stateParams.id ? id : undefined;

    var toSend = _.assign({}, params, {brandId: brand_id});
    $state.go("tab.brand-products", toSend);

  };


  $scope.openbrandPopover = (brand_id) => {
    Brand.getProducts({id:brand_id}).then((products) => {
      $scope.chosenBrand = products;
      $scope.brandPopover.show();
      console.log('$scope.chosenBrand', $scope.chosenBrand)
    });
  };

  $scope.goToBrandFollowPage = () => {
    $state.go("tab.brand-follow")
  };


  $scope.onBlindChange = (index) => {

    if( $scope.chosenBrands.indexOf(index) == -1 ) {

      $scope.chosenBrands.push(index);
    } else {

      $scope.chosenBrands = _.filter($scope.chosenBrands, (item) => item != index);

    }

  };

  $scope.follow = (brand) => {

    if(brand.isLiked) {

      Brand.removeLiked(brand.id);
      brand.isLiked = false;

    } else {

      Brand.addLiked(brand.id);
       brand.isLiked = true;

    }
  };

  $scope.update = () => {

    console.log($scope.chosenBrands)
    Brand.saveInLocalStorage($scope.chosenBrands);

    Brand.getLiked().then((data) => {
      $scope.likedBrands = data;
      if(data.length > 0) $scope.digest();
      console.log('likedBrands', data)
    });

  };

  $scope.isSelected = (index) => $scope.chosenBrands.indexOf(index) !== -1;

  $scope.filter = function(params) {

    if($stateParams.id) params.brandId = $stateParams.id;

    Item.getFiltered(params).then((data) => {

      $scope.products = data;

    });
  }

}
