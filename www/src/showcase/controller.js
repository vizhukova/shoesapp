import _ from 'lodash';

export default function($scope, $ionicPopover, $state, $stateParams, Brand, Category, Item) {

  $scope.filterBy = ['Category', 'Size', 'Color'];
  $scope.chosenMenuItem = {};
  $scope.chosenFilter = {};
  $scope.animation = 'slide-in-up';

  $scope.titleName = '123455';

  $scope.sizes = [{
      "id": 1,
      "name": "37"
    },
    {
      "id": 2,
      "name": "38"
    },
    {
      "id": 3,
      "name": "39"
    }];


  var filterObj = _.omit($stateParams, Object.keys($stateParams).map((key) => {
    if($stateParams[key] == undefined) return key;
  }));

  console.log('filterObj', filterObj);

  setTitle(filterObj);

  if($state.current.name == 'tab.me' && $state.current.url == '/me') {

    Item.getLiked().then((data) => {
      $scope.products = data;
    });

  } else {

    Item.getFiltered(filterObj).then((data) => {
      $scope.products = data;
      console.log('products', data)
    });

  }



  Category.get().then((data) => {

    $scope.categories = data.map((item) => [item]);
  });

  var popups = [
    {name: 'sortPopover', url: './src/shop/sort-popover.html'},
    {name: 'filterPopover', url: './src/shop/filter-popover/filter-popover.html'}
  ];

    $ionicPopover.fromTemplateUrl('./src/shop/filter-popover/filter-popover.html', {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope['filterPopover'] = popover;
    });

    $scope[`openfilterPopover`] = (filter)=>{
      $scope.chosenMenuItem = {
        name: filter
      };
      $scope['filterPopover'].show();
    };

  $scope.setChosenFilter = (name) => {
    $scope.chosenMenuItem = {
      name: name
    }
  }

  $scope.getCategoryTree = (category_id) => {

    Category.getArrayTree(category_id).then((data) => {

      var result = _.find($scope.categories[$scope.categories.length - 1], data[data.length - 1][0]); // если у выбранной категории нет подкатегорий

      if(! result) $scope.categories = data;
      else $scope.chosenFilter['sectionId'] = category_id;

      $scope.$digest();
    })
  };

  $scope.showResult = () => {
    $scope.filterPopover.hide();
    $scope.filter($scope.chosenFilter);
  }

  $scope.reset = () => {

    $scope.chosenFilter = {};

  };

  $scope.addLiked = (product_id, e) => {
    e.stopPropagation();
    Item.addLiked(product_id);

    _.find($scope.products, {id: product_id}).isLiked = true;
  };

  $scope.removeLiked = (product_id, e) => {
    e.stopPropagation();
    Item.removeLiked(product_id);

     _.find($scope.products, {id: product_id}).isLiked = false;
  };

  $scope.openProduct = (product, $event) => {
    $state.go('tab.shop-product', {id: product.id});

  };

  function setTitle(filterObj) {
    if(filterObj.feature) {
      switch(filterObj.feature) {
        case 'new':  $scope.titleName = 'New Arrival';
              break;
        case 'popular':  $scope.titleName = 'Popular';
              break;
        case 'sale':  $scope.titleName = 'Sale';
              break;
      }
    }
  }


}
