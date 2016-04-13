export default function($scope, $ionicPopover, Category) {

  $scope.cats = Category.get();

  $scope.icons = {
    women: 'ion-woman',
    men: 'ion-man',
    kids: 'ion-ios-football',
    beauty: 'ion-ios-rose',
    lifestyle: 'ion-bug'
  };

  $scope.isSearchOnFocus = false;
  $scope.isRecentSearchesShow = false;

  $scope.includes = {
    lastSearches: 'src/search/directives/last-searches.html',
    topSearches: 'src/search/directives/top-searches.html'
  };

  var popups = [
    {name: 'categoryPopover', url: 'src/shop/category-popover.html'}
  ];

  $ionicPopover.fromTemplateUrl('src/shop/category-popover.html', {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope.popover = popover;
    });

    $scope.openPopover = ($event)=>{
      $scope.popover.show($event);
    };


  $scope.onSearchFocus = (e) => {
    $scope.isSearchOnFocus = $scope.isRecentSearchesShow = true;
  }

  $scope.onCancelClick = (e) => {
    $scope.isSearchOnFocus = $scope.isRecentSearchesShow = false;
  }

  $scope.onCloseResentSearchClick = (e) => {
    $scope.isRecentSearchesShow = false;
  }


}
