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

.directive('categoryContent', function () {

  return {
    restrict: 'E',
    templateUrl: './src/shop/category-content.html',
    controller: 'CategoryContentCtrl'
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
})

.directive('likedSlider', function () {

  return {
    restrict: 'E',
    templateUrl: './src/shop/liked-slider.html'
  }
})

.directive('tileSlider', function () {

  return {
    restrict: 'E',
    templateUrl: './src/shop/tile-slider.html'
  }
})

.directive('categoryMenu', function () {

  return {
    restrict: 'E',
    templateUrl: './src/shop/category-menu.html'
  }
})

.directive('categoryPopover', function () {

  return {
    restrict: 'E',
    templateUrl: './src/shop/category-popover.html'
  }
})


// Showcase with products directive
.directive('showcase', function () {

  return {
    restrict: 'E',
    templateUrl: './src/showcase/template.html',
    controller: 'ShowcaseCtrl'
  }
})
  //Product item in showcase
  .directive('product', function () {

    return {
      restrict: 'E',
      templateUrl: './src/showcase/directives/templates/product.html',
      controller: 'productCtrl'
    }
  })

// Product container for product in product subtab
.directive('productContainer', function () {

  return {
    restrict: 'E',
    templateUrl: './src/product/directives/product.container.html'
  }
})

.directive('focusIf', function ($timeout) {

   function link($scope, $element, $attrs) {
            var dom = $element[0];
            if ($attrs.focusIf) {
                $scope.$watch($attrs.focusIf, focus);
            } else {
                focus(true);
            }
            function focus(condition) {
                if (condition) {
                    $timeout(function() {
                        dom.focus();
                    }, $scope.$eval($attrs.focusDelay) || 0);
                }
            }
        }
        return {
            restrict: 'A',
            link: link
        };
})

.directive('imageLoader', function () {

  return {
    restrict: 'E',
    templateUrl: './src/shop/image-loader.html',
    scope: {
      width: '@',
      height: '@',
      src: '@'
    },
    link: function(scope, element, attributes) {

      scope.isLoaded = false;

      function PreLoadImage( objSettings, callback ) {

        var thePic = new Image();

         thePic.onload = function() {
              callback();
           console.log('uploaded')
         };

         thePic.onerror = function(err) {
              console.error('Error load image in PreLoadImage', err)
         };

         thePic.src = objSettings.src;
      }

      PreLoadImage(scope, ()=> {scope.isLoaded = true});

    }
  }
})



