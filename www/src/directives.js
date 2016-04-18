angular.module('starter.directives', [])

.directive('categories', function (Category, $timeout) {

  return {
    restrict: 'E',
    scope: {cats: '='},
    replace: true,
    templateUrl: './src/shop/category.html',
    link: (scope) => {

      // Get categories [...] from Category service
      scope.cats = Category.get();
      scope.activeCat = scope.cats[0];

      var underline = $('.active-line');

      // Init underline width & left
      $timeout(()=>{

        var text = $('.cat-text');

        underline.animate({
          width: text.width(),
          left: text.offset().left
        });
      });

      // Set active category
      scope.setActive = (index) => {
        scope.activeCat = scope.cats[index];
        scope.animate(index)
      };

      // Animate navigation menu underline
      scope.animate = (index) => {

        var item = $('.cat-text').get(index);

        underline.animate({
          left: $(item).offset().left - 1,
          width: $(item).width() + 2
        }, 300)

      };

      // Set active class for category navigation menu
      scope.isActive = (cat) => cat === scope.activeCat;
    }
  }
})

.directive('categoryContent', function () {

  return {
    scope: {},
    restrict: 'E',
    templateUrl: './src/shop/category-content.html',
    controller: 'CategoryContentCtrl'
  }
})

.directive('slider', function (Category) {

  return {
    scope: {},
    restrict: 'E',
    templateUrl: './src/shop/slider.html'
  }
})

.directive('likedCat', function (Category) {

  return {
    scope: {},
    restrict: 'E',
    templateUrl: './src/shop/liked-cat.html'
  }
})

.directive('likedSlider', function () {

  return {
    scope: {
      widget: '='
    },
    restrict: 'E',
    replace: true,
    templateUrl: './src/shop/liked.slider.html',
    link: (scope, element, attrs) => {


      // Width of scrollable area depend on count items
      scope.width = (1 + scope.widget.items.length) * 11 + 1 + 'em';

    }
  }
})

.directive('gallerySlider', function ($timeout) {

  return {
    scope: {
      widget: '='
    },
    restrict: 'E',
    replace: true,
    templateUrl: './src/shop/gallery.slider.html',
    link: (scope, element, attrs) => {

      $timeout(()=> {
        var mySwiper = new Swiper ('.swiper-container', {
          // Optional parameters
          direction: 'horizontal',
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 7,
          loop: true
        })
      })
    }
  }
})

.directive('tileSlider', function () {

  return {
    scope: {
      widget: '='
    },
    replace: true,
    restrict: 'E',
    templateUrl: './src/shop/tile.slider.html',
    link: (scope, element, attrs) => {

    }

  }
})

.directive('thematicSlider', function ($timeout) {

  return {
    scope: {
      widget: '='
    },
    replace: true,
    restrict: 'E',
    templateUrl: './src/shop/thematic.slider.html',
    link: (scope, element, attrs) => {

      $timeout(()=> {
        var thematicSlider = new Swiper ('.thematic-container', {
          // Optional parameters
          direction: 'horizontal',
          slidesPerView: 'auto',
          centeredSlides: true,
          pagination: '.swiper-pagination',
          paginationHide: false,
          spaceBetween: 10
        })
      })
    }

  }
})

.directive('categoryMenu', function () {

  return {
    scope: {},
    restrict: 'E',
    templateUrl: './src/shop/category-menu.html'
  }
})

.directive('categoryPopover', function () {

  return {
    scope: {},
    restrict: 'E',
    templateUrl: './src/shop/category-popover.html'
  }
})


// Showcase with products directive
.directive('showcase', function () {

  return {
    scope: {},
    restrict: 'E',
    templateUrl: './src/showcase/template.html',
    controller: 'ShowcaseCtrl'
  }
})
  //Product item in showcase
  .directive('product', function () {

    return {
      scope: {},
      restrict: 'E',
      templateUrl: './src/showcase/directives/templates/product.html',
      controller: 'productCtrl'
    }
  })

// Product container for product in product subtab
.directive('productContainer', function () {

  return {
    scope: true,
    restrict: 'E',
    templateUrl: './src/product/directives/product.container.html'
  }
})

// Header with join button
.directive('joinHeader', function () {

  return {
    scope: {},
    restrict: 'E',
    replace: true,
    templateUrl: './src/partial/join.header.html',
    controller: 'joinHeaderCtrl'
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
    replace: true,
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



