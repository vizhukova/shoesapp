export default function($scope, $ionicPopover, $state, $stateParams, Brand, Category, Item) {

  $scope.filterBy = ['Category', 'Size', 'Color'];
  $scope.chosenMenuItem = {};
  $scope.chosenFilter = {};
  $scope.animation = 'slide-in-up';


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

  var filterObj = $stateParams;

  Item.getFiltered(filterObj).then((data) => {
    $scope.products = data;
  });


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
  }

  $scope.showResult = () => {
    $scope.filterPopover.hide();
    $scope.filter($scope.chosenFilter);
  }

  $scope.reset = () => {

    $scope.chosenFilter = {};

  }

  $scope.openProduct = (product, $event) => {
    console.log('openProduct', product.id)
    $state.go('tab.shop-product', {id: product.id});

  };


}
