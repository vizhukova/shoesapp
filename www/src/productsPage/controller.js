import _ from 'lodash';

export default function($scope, $ionicPopover, $state, $stateParams, Brand, Item, Category, Size, Color) {

  $scope.filterBy = ['Category', 'Size', 'Color'];
  $scope.chosenMenuItem = {};
  $scope.chosenFilter = {};   // для фильтрации
  $scope.animation = 'slide-in-up';
  var chosenCategory = {}; //для отображения дерева категорий

  var filterObj = _.omit($stateParams, Object.keys($stateParams).map((key) => {
    if($stateParams[key] == undefined) return key;
  }));

  Size.get().then((data) => {
    $scope.sizes = data;
  });

  Color.get().then((data) => {
    $scope.colors = data;
  });

  Category.get().then((data) => {
    $scope.categories = data;

    $scope.tabTitle = getTitle();
  })

  Item.getFiltered(filterObj).then((data) => {
    $scope.products = data;
  });


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

  $scope.getCategoryTree = (category_id) => {  //получение нового дерева категорий и сохранение фильтра по выбранной категории

    Category.getArrayTree(category_id).then((data) => {

      if(! data) {
        $scope.chosenFilter['sectionId'] = category_id;
        chosenCategory.id = category_id;
      }

      else if( chosenCategory.id ===  category_id) {

        Category.closeNode(category_id).then((data) => {
          $scope.categories = data;
          chosenCategory.id = undefined;
          $scope.$digest();
        });

      }

      else {
        $scope.categories = data;
        chosenCategory.id = category_id;
      }

      $scope.$digest();
    });

    console.log('$scope.categories !!!!!!!!!', $scope.categories)
  };

  $scope.setChosenSize = (size_id) => { // сохранение фильтра по выбранному размеру
     $scope.chosenFilter['size'] = size_id;
  };

  $scope.setChosenColor = (color_id) => { // сохранение фильтра по выбранному размеру
     $scope.chosenFilter['color'] = color_id;
  };

  $scope.showResult = () => {
    $scope.filterPopover.hide();
    $scope.filter($scope.chosenFilter);
  };

  $scope.reset = () => {
    $scope.chosenFilter = {};
  };

  //$scope.addLiked = (product_id, e) => {
  //  e.stopPropagation();
  //  Item.addLiked(product_id);
  //
  //  _.find($scope.products, {id: product_id}).isLiked = true;
  //};
  //
  //$scope.removeLiked = (product_id, e) => {
  //  e.stopPropagation();
  //  Item.removeLiked(product_id);
  //
  //   _.find($scope.products, {id: product_id}).isLiked = false;
  //};

  //$scope.openProduct = (product, $event) => {
  //  $state.go('tab.shop-product', {id: product.id});
  //
  //};

  function getTitle() {

    var title = '';

    debugger

    if(filterObj.feature) {
      switch(filterObj.feature) {
        case 'new':  title = 'New Arrival';
              break;
        case 'popular':  title = 'Popular';
              break;
        case 'sale':  title = 'Sale';
              break;
      }
    }

    else if(filterObj.sectionId) {

      title = _.find($scope.categories, {id: filterObj.sectionId}).name;
    }

    return title;
  };

  $scope.filter = () => {
    var filterBy = {};
    _.assign(filterBy, filterObj, $scope.chosenFilter);

     Item.getFiltered(filterBy).then((data) => {
      $scope.products = data;
      console.log('products', data)
      $scope.$digest();
    });

  }

}
