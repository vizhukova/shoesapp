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
