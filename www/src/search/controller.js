export default function($scope, $state, $ionicPopover, Category) {

  Category.get().then((data) => {
    $scope.categories = data;
  });

  $scope.icons = {
    women: 'ion-woman',
    men: 'ion-man',
    kids: 'ion-ios-football',
    beauty: 'ion-ios-rose',
    lifestyle: 'ion-bug'
  };

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

    $scope.openPopover = ($event)=>{
      $scope.popover.show($event);
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
    $state.go($state.go("tab.shop-products", param));
  };

}
