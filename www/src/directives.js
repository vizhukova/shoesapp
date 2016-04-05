angular.module('starter.directives', [])

.directive('categories', function (Category) {

  return {
    restrict: 'E',
    scope: {cats: '='},
    templateUrl: './src/shop/category.html',
    link: (scope) => {

      // Get categories [...] from Category service
      scope.cats = Category.get();
    }
  }
})

.directive('slider', function (Category) {

  return {
    restrict: 'E',
    templateUrl: './src/shop/slider.html'
  }
})

.directive('likedCat', function (Category) {

  return {
    restrict: 'E',
    templateUrl: './src/shop/liked-cat.html'
  }
});
