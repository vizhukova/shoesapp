import _ from 'lodash'

export default function($scope, $state, $stateParams, $ionicHistory, Category, Brand) {


  var filterBy = {};
  $scope.categoryService = Category;

  if(! filterBy.sectionId) {
    onChangeCategory( $scope.categoryService.getActive() );
  }

  Category.get().then((data) => {
    $scope.cats = data;
  });

   $scope.goToBrand = (brand_id) => {

    $state.go("tab.brand", {id: brand_id});

  };

   $scope.openProduct = (product, $event) => {
    $state.go('tab.shop-product', {id: product.id});

  };

  $scope.toBrandProducts = (id) => {

    $state.go("tab.brand-products", {brandId: id});

  };


  $scope.$watch('categoryService.getActive()', (newVal) => {

    if(newVal) {

     onChangeCategory(newVal);

    }

  })


  function onChangeCategory(value) {

     filterBy = _.assign({}, {sectionId: value.id}, $stateParams);

    filterBy = _.omit(filterBy, Object.keys(filterBy).map((key) => {
      if(filterBy[key] == undefined) return key;
    }));

     Brand.getFullFiltered(filterBy).then((brands) => {
       $scope.brands = brands;
     });

  }

}
