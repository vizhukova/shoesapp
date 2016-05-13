import _ from 'lodash'

export default function($scope, $state, $stateParams, $ionicHistory, Category, Brand) {

  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.activeCat = {};

   $scope.goToBrand = (brand_id) => {

    $state.go("tab.brand", {id: brand_id});

  };

   $scope.openProduct = (product, $event) => {
    $state.go('tab.shop-product', {id: product.id});

  };


  $scope.$watch('activeCat', (newVal) => {
    $scope.activeCat = newVal;

    Category.get().then((data) => {
    $scope.cats = data;

     var filterBy = _.assign({}, {sectionId: $scope.activeCat.id}, $stateParams);

     Brand.getFiltered(filterBy).then((brands) => {
       $scope.brands = brands;
     });

  });

  })
}
