export default function($scope, $state, $ionicPopover, $stateParams, Category) {

  Category.get().then((data) => {
    $scope.categories = $scope.mainCategories = data;
  });

 // $scope.isSearchOnFocus = false;
  $scope.isRecentSearchesShow = false;

  $scope.includes = {
    lastSearches: 'src/search/directives/last-searches.html',
    topSearches: 'src/search/directives/top-searches.html'
  };

  $ionicPopover.fromTemplateUrl('src/shop/category-popover.html', {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope.popover = popover;
    });

    $scope.openPopover = (category_id, $event)=>{

      $event.stopPropagation();
      $scope.popover.show($event);

      Category.getArrayTree(category_id).then((data) => {
        $scope.categories = data[0].items;
        console.log('subCats', data[0].items)
      })
    };


  $scope.onFocus = (e) => {
    $scope.isRecentSearchesShow = true;
  };

  $scope.onCancelClick = (e) => {
   $scope.isRecentSearchesShow = false;
  };

  $scope.onCloseResentSearchClick = (e) => {
    $scope.isRecentSearchesShow = false;
  };

  $scope.goToProducts = (param) => {
    $scope.popover.hide();
    $state.go($state.go("tab.search-products", param));
  };

}
