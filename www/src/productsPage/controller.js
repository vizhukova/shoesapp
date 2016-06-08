import _ from 'lodash';

export default function($scope, $timeout, $ionicPopover, $state, $stateParams, Brand, Item, Category, Size, Color) {

  $scope.filterBy = ['Категория', 'Размер', 'Цвет'];
  $scope.chosenMenuItem = {};
  $scope.chosenFilter = {};   // для фильтрации
  $scope.animation = 'slide-in-up';
  $scope.products = []; // массив продуктов
  var chosenCategory = {}; //для отображения дерева категорий
  var oldChosenFilter = {}; //для сохранения старого состояния объекта фильтрации
  var page = 0; // текущая просматриваемая страница

  var filterObj = _.omit($stateParams, Object.keys($stateParams).map((key) => {
    if($stateParams[key] == undefined) return key;
  }));

  if(filterObj.q) {
     console.log('searchPhrase', $stateParams.q)
    $scope.searchPhrase = $stateParams.q;
  }

  Item.resetNav();

  setTitle();

  function setTitle() {

     getTitle().then((title) => {
      $scope.tabTitle = title;
      console.log('TITLEEEEE', title)
      $scope.$digest();
    });

  }

  Size.get().then((data) => {
    $scope.sizes = data;
  });

  Color.get().then((data) => {
    $scope.colors = data;
  });

  Category.get().then((data) => {
    $scope.categories = data;
  })

  Category.getAll().then((data) => {
    $scope.allCategories = data;
  })




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
    {name: 'filterPopover', url: './src/productsPage/filter-popover/filter-popover.html'}
  ];

    $ionicPopover.fromTemplateUrl('./src/productsPage/filter-popover/filter-popover.html', {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope['filterPopover'] = popover;
    });

    $scope[`openfilterPopover`] = (filter)=>{
      $scope.chosenMenuItem = {
        name: filter
      };

      oldChosenFilter = _.cloneDeep($scope.chosenFilter);
      $scope['filterPopover'].show();
    };

  $scope.setChosenFilter = (name) => {
    $scope.chosenMenuItem = {
      name: name
    }
  };

  $scope.getFilterName = (name) => {

    var nameToReturn;

    switch(name) {
      case $scope.filterBy[0]: if($scope.chosenFilter['sectionId']) {
                        nameToReturn = _.find($scope.allCategories, {id: $scope.chosenFilter['sectionId']}).name;
                      }
                  break;
      case $scope.filterBy[1]: if($scope.chosenFilter['size']) {
                      nameToReturn = _.find($scope.sizes, {id: $scope.chosenFilter['size']}).name;
                    }
                  break;
      case $scope.filterBy[2]: if($scope.chosenFilter['color']) {
                      nameToReturn = _.find($scope.colors, {id: $scope.chosenFilter['color']}).name;
                    }
                  break;

    }

    return nameToReturn || 'Все';
  };

  $scope.getCategoryTree = ($event, category_id) => {  //получение нового дерева категорий и сохранение фильтра по выбранной категории

    debugger
    $event.stopPropagation();
  console.time('getCategoryTree')
    Category.getArrayTree(category_id).then((data) => {
      console.timeEnd('getCategoryTree')
      if( $scope.chosenFilter['sectionId'] == category_id ) {
        $scope.chosenFilter=  _.omit($scope.chosenFilter, ['sectionId']);
      }

      else if(! data) {
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
        chosenCategory.id = $scope.chosenFilter['sectionId'] = category_id;
      }

      $timeout(() => {$scope.$digest()}, 50);
    });

    console.log('$scope.categories !!!!!!!!!', $scope.categories)
  };

  $scope.setChosenSize = (size_id) => { // сохранение фильтра по выбранному размеру

    if( $scope.chosenFilter['size'] == size_id ) {
      $scope.chosenFilter =  _.omit($scope.chosenFilter, ['size']);
    } else {
      $scope.chosenFilter['size'] = size_id;
    }

  };

  $scope.setChosenColor = (color_id) => { // сохранение фильтра по выбранному размеру

    if( $scope.chosenFilter['color'] == color_id ) {
      $scope.chosenFilter =  _.omit($scope.chosenFilter, ['color']);
    } else {
      $scope.chosenFilter['color'] = color_id;
    }

  };

  $scope.showResult = () => {
    $scope.filterPopover.hide();
    $scope.filter($scope.chosenFilter);

    if($scope.chosenFilter.sectionId || filterObj.sectionId){

      filterObj.sectionId = $scope.chosenFilter.sectionId || filterObj.sectionId;

    }
    setTitle();

  };

  $scope.reset = () => {

    //Category.getFirstLevelParentNode($scope.chosenFilter.sectionId || filterObj.sectionId).then((parentNode) => {

    Item.resetNav();
      filterObj = {};
      $scope.chosenFilter = _.omit( $scope.chosenFilter, ['sectionId']);
      setTitle();
    //})

  };

  $scope.hidePopover = () => {
    $scope.chosenFilter = _.cloneDeep(oldChosenFilter);
    $scope.filterPopover.hide();
  };

  function getTitle() {

    return new Promise((resolve, reject) => {
      var title = '';

      debugger

      if(filterObj.q) {
        resolve('');
      }

      else if(filterObj.feature) {
        switch(filterObj.feature) {
          case 'new':  title = 'Новые поступления';
                break;
          case 'popular':  title = 'Популярные';
                break;
          case 'sale':  title = 'Распродажа';
                break;
        }

        resolve(title);
      }

      else if(filterObj.sectionId) {
          Category.getFirstLevelParentNode(filterObj.sectionId).then((category) => {
            resolve(category.name);
            $scope.chosenFilter.sectionId = filterObj.sectionId;
          })
      }

      else if(filterObj.brandId) {
        Brand.get({id: filterObj.brandId}).then((brand) => {
          resolve(brand.name);
        })
      }

      else {
        resolve('');
      }
    })

  };

  $scope.filter = () => {
    var filterBy = {};
    _.assign(filterBy, filterObj, $scope.chosenFilter, {page: page});

     Item.getFilteredNav(filterBy).then((data) => {
      $scope.products = data;
      console.log('products', data)
      $scope.$digest();
    });

    page = 1;
    Item.resetNav();

    //$scope.loadMore(true);

  };

  $scope.loadMore = () => {
    page ++;

    var filterBy = {};
    debugger

    filterBy = _.assign({}, filterObj, {page: page});

    Item.getFilteredNav(filterBy).then((data) => {
      $scope.products = _.concat($scope.products, data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }

}
