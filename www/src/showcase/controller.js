import _ from 'lodash';

export default function($scope, $ionicPopover, $state, $stateParams, Brand, Item) {

  $scope.addLiked = (product, e) => {
    e.stopPropagation();
    Item.addLiked(product.id);
    product.isLiked = true;
  };

  $scope.removeLiked = (product, e) => {
    e.stopPropagation();
    Item.removeLiked(product.id);
    product.isLiked = false;
  };

  $scope.openProduct = (product, $event) => {
    $state.go('tab.shop-product', {id: product.id});

  };

}
