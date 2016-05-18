import _ from 'lodash';

export default function($scope, $ionicPopover, $state, $stateParams, Brand, Item, Category, Size, Color) {

  //$scope.filterBy = ['Category', 'Size', 'Color'];
  //$scope.chosenMenuItem = {};
  //$scope.chosenFilter = {};   // для фильтрации
  //var chosenCategory = {}; //для отображения дерева категорий
  //$scope.animation = 'slide-in-up';
  //
  //$scope.titleName = '123455';
  //
  //Size.get().then((data) => {
  //  $scope.sizes = data;
  //});
  //
  //Color.get().then((data) => {
  //  $scope.colors = data;
  //});
  //
  //Category.get().then((data) => {
  //
  //  $scope.categories = data;
  //  console.log("CATEGORIES", data)
  //
  //});

  //var filterObj = _.omit($stateParams, Object.keys($stateParams).map((key) => {
  //  if($stateParams[key] == undefined) return key;
  //}));

  //console.log('filterObj', filterObj);
  //
  //setTitle(filterObj);
  //
  //if($state.current.name == 'tab.me' && $state.current.url == '/me') {
  //
  //  Item.getLiked().then((data) => {
  //    $scope.products = data;
  //  });
  //
  //} else {
  //
  //  Item.getFiltered(filterObj).then((data) => {
  //    $scope.products = data;
  //    console.log('products', data)
  //  });
  //
  //}

  //данные для тестирования отображения дерева категори й
  //$scope.categories = [
  //  {name: 'fdggd1', id: 1, deptLevel: 1, items: [
  //    {
  //      name: 'fdggd21', id: 1, deptLevel: 2
  //    }, {
  //      name: 'fdggd22', id: 1, deptLevel: 2,
  //      items : [
  //        { name: 'fdggd31', id: 1, deptLevel: 3},
  //        { name: 'fdggd32', id: 1, deptLevel: 3, items: [
  //          { name: 'fdggd41', id: 1, deptLevel: 4},
  //          { name: 'fdggd42', id: 1, deptLevel: 4}
  //        ]}
  //      ]
  //    }
  //  ]}, {name: 'fdggd1', id: 1, deptLevel: 1, items: [
  //    {
  //      name: 'fdggd21', id: 1, deptLevel: 2
  //    }, {
  //      name: 'fdggd22', id: 1, deptLevel: 2
  //    }
  //  ]}
  //]


  //var popups = [
  //  {name: 'sortPopover', url: './src/shop/sort-popover.html'},
  //  {name: 'filterPopover', url: './src/shop/filter-popover/filter-popover.html'}
  //];
  //
  //  $ionicPopover.fromTemplateUrl('./src/shop/filter-popover/filter-popover.html', {
  //    scope: $scope,
  //    animation: $scope.animation
  //  }).then((popover)=>{
  //    $scope['filterPopover'] = popover;
  //  });
  //
  //  $scope[`openfilterPopover`] = (filter)=>{
  //    $scope.chosenMenuItem = {
  //      name: filter
  //    };
  //    $scope['filterPopover'].show();
  //  };
  //
  //$scope.setChosenFilter = (name) => {
  //  $scope.chosenMenuItem = {
  //    name: name
  //  }
  //}

  //$scope.getCategoryTree = (category_id) => {
  //
  //  Category.getArrayTree(category_id).then((data) => {
  //
  //    if(! data) {
  //      $scope.chosenFilter['sectionId'] = category_id;
  //      chosenCategory.id = category_id;
  //    }
  //
  //    else if( chosenCategory.id ===  category_id) {
  //
  //      Category.closeNode(category_id).then((data) => {
  //        $scope.categories = data;
  //        chosenCategory.id = undefined;
  //        $scope.$digest();
  //      });
  //
  //    }
  //
  //    else {
  //      $scope.categories = data;
  //      chosenCategory.id = category_id;
  //    }
  //
  //    $scope.$digest();
  //  });

  //  console.log('$scope.categories !!!!!!!!!', $scope.categories)
  //};  //получение нового дерева категорий и сохранение фильтра по выбранной категории
  //
  //$scope.setChosenSize = (size_id) => { // сохранение фильтра по выбранному размеру
  //   $scope.chosenFilter['size'] = size_id;
  //};
  //
  //$scope.setChosenColor = (color_id) => { // сохранение фильтра по выбранному размеру
  //   $scope.chosenFilter['color'] = color_id;
  //};
  //
  //$scope.showResult = () => {
  //  $scope.filterPopover.hide();
  //  $scope.filter($scope.chosenFilter);
  //};
  //
  //$scope.reset = () => {
  //
  //  $scope.chosenFilter = {};
  //
  //};

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

  //function setTitle(filterObj) {
  //  if(filterObj.feature) {
  //    switch(filterObj.feature) {
  //      case 'new':  $scope.titleName = 'New Arrival';
  //            break;
  //      case 'popular':  $scope.titleName = 'Popular';
  //            break;
  //      case 'sale':  $scope.titleName = 'Sale';
  //            break;
  //    }
  //  }
  //}
  //
  //$scope.filter = () => {
  //  var filterBy = _.assign(filterObj, $scope.chosenFilter);
  //
  //   Item.getFiltered(filterBy).then((data) => {
  //    $scope.products = data;
  //    console.log('products', data)
  //  });
  //
  //}

}
