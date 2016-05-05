import _ from 'lodash';

angular.module('starter.directives', [])

  .directive('categories', function (Category, $timeout) {

    return {
      restrict: 'E',
      scope: {cats: '='},
      replace: true,
      templateUrl: './src/shop/category.html',
      link: (scope) => {

        // Get categories [...] from Category service
        if(scope.cats) {

          scope.activeCat = scope.cats[0].id;


          var underline = $('.active-line');

          // Init underline width & left
          $timeout(()=> {

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
    }
  })

  .directive('categoryContent', function () {

    return {
      scope: {},
      restrict: 'E',
      templateUrl: './src/shop/category-content.html',
      scope: true
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
        widget: '=',
        click: '='
      },
      restrict: 'E',
      replace: true,
      templateUrl: './src/shop/liked.slider.html',
      controller: 'ShowcaseCtrl',

      link: (scope, element, attrs) => {

        // Width of scrollable area depend on count items
        scope.$watch('widget', function(newValue, oldValue) {
            if(newValue && newValue.items) {
              scope.width = (1 + newValue.items.length) * 11 + 1 + 'em';
            }
        });

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
          var mySwiper = new Swiper('.swiper-container', {
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
          var thematicSlider = new Swiper('.thematic-container', {
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
      restrict: 'E',
      templateUrl: './src/showcase/template.html',
      controller: 'ShowcaseCtrl',
      scope: true
    }
  })
  //Product item in showcase
  .directive('product', function () {

    return {
      restrict: 'E',
      templateUrl: './src/showcase/directives/templates/product.html',
      controller: 'ShowcaseCtrl',
      scope: true
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
          $timeout(function () {
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
      templateUrl: './src/partial/image-loader.html',
      replace: true,
      scope: {
        width: '@',
        height: '@',
        src: '@'
      },
      link: function (scope, element, attributes) {

        scope.isLoaded = false;

        function PreLoadImage(objSettings, callback) {

          var thePic = new Image();

          thePic.onload = function () {
            callback();
            console.log('uploaded')
          };

          thePic.onerror = function (err) {
            console.error('Error load image in PreLoadImage', err)
          };

          thePic.src = objSettings.src;
        }

        PreLoadImage(scope, ()=> {
          scope.isLoaded = true
        });

      }
    }
  })

  .directive('brandSlider', function () {

    return {
      scope: {},
      restrict: 'E',
      replace: true,
      templateUrl: './src/brands/directives/brand.slider.html',
      controller: 'BrandsCtrl',

      link: (scope, element, attrs) => {


        // Width of scrollable area depend on count items
        scope.width = (1 + scope.widget.items.length) * 11 + 1 + 'em';

      }
    }
  })

  .directive('buyProduct', function ($ionicPopover, Item) {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: './src/product/directives/buy.product.html',
      scope: {
        item: '=',
        brand: '='
      },
      controller: 'ProductCtrl'

    //  link: (scope) => {
    //
    //  scope.animation = 'slide-in-up';
    //
    //  var popups = [
    //    {name: 'detailPopover', url: './src/product/directives/detail.popover.html'},
    //    {name: 'basketPopover', url: './src/product/directives/basket.popover.html'}
    //  ];
    //
    //    popups.map((popup)=>{
    //    $ionicPopover.fromTemplateUrl(popup.url, {
    //      scope: scope,
    //      animation: scope.animation
    //    }).then((popover)=>{
    //      scope[popup.name] = popover;
    //    });
    //
    //    scope[`open${popup.name}`] = ()=>{
    //      scope[popup.name].show();
    //    };
    //
    //  });
    //
    //
    //scope.chosenProduct  =  {
    //  quantity: 1,
    //  price: scope.item.price
    //};
    //
    //scope.shipTo = [];
    //
    //scope.addShipAddress = (data) => {
    //  console.log(scope.addressForm);
    //};
    //
    //scope.changeQuantityProduct = (value) => {
    //
    //  if( (value < 0 && scope.chosenProduct.quantity > 0) || value > 0) {
    //    scope.chosenProduct.quantity += value;
    //  }
    //};
    //
    //scope.setChosenType = (type) => {
    //
    //    scope.chosenType = scope.chosenType == type ? undefined : type;
    //    console.log(scope.chosenType)
    //
    //  };
    //
    //scope.openCardData = (data) => {
    //      scope.isOpenCardPage = data;
    //  };
    //
    //scope.like = (isLiked, id) => {
    //
    //  new Promise((resove, reject) => {
    //
    //    if(isLiked) {
    //      return Item.like({id: id});
    //    } else {
    //      return Item.dislike({id: id});
    //    }
    //
    //  }).then((data) => {
    //    debugger
    //  })
    //
    //};
    //
    //}
    }
  })

  .directive('brandPicture', function () {

    return {
      scope: {
        brand: '='
      },
      restrict: 'E',
      replace: true,
      templateUrl: './src/brands/directives/brand.picture.html',
      link: (scope) => {

      }
    }
  })

  .directive('brandPicture2', function () {

    return {
      scope: {},
      restrict: 'E',
      replace: true,
      templateUrl: './src/brands/directives/brand.picture2.html'

    }
  })

  .directive('productRecommend', function () {

    return {
      scope: {
        widget: '=',
        click: '='
      },
      restrict: 'E',
      replace: true,
      templateUrl: './src/brands/directives/product.recommend.html',
      controller: 'ShowcaseCtrl',

      link: (scope, element, attrs) => {
        scope.width = (1 + scope.widget.items.length) * 11 + 1 + 'em';

      }

    }
  })

  .directive('brandFollow', function () {

    return {
      restrict: 'E',
      //replace: true,
      templateUrl: './src/brands/directives/brand.follow.html',
      controller: 'BrandsCtrl',
      scope: {
        widget: '='
      },

      link: (scope, element, attrs) => {
        if(scope.widget && scope.widget.items) scope.width = (1 + scope.widget.items.length) * 11 + 1 + 'em';
      }
    }
  })

  .directive('brandList', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: './src/brands/directives/brand.list.html',
      scope: {
        items: '=',
        goto: '=',
        gotofollowpage: '='
      },

      link: (scope, element, attrs) => {
        if(scope.items) scope.width = (1 + scope.items.length) * 5 + 1 + 'em';
      }
    }
  })

  .directive('brandBlock', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: './src/brands/directives/brand.block.html',
      controller: 'BrandsCtrl',
      scope: true
    }
  })

  .directive('productsPage', function () {

    return {
      restrict: 'E',
      templateUrl: './templates/products.page.html',
      controller: 'ShowcaseCtrl'
      //scope: true,

    }
  })

  .directive('searchPanel', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: './src/partial/search.panel.html',
      scope: true,
      controller: 'SearchPanelCtrl'
    }

  })

  .directive('size', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/order/directives/size.html',
      scope: true
    }

  })

  .directive('addressFields', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/order/directives/addressFields.html',
      scope: true
    }

  })

  .directive('payment', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/order/directives/payment.html',
      scope: true
    }

  })

  .directive('shippingFields', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/order/directives/shippingFields.html',
      scope: true
    }

  })

  .directive('totalFields', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/order/directives/totalFields.html',
      scope: true
    }

  })

  .directive('alertItem', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/alerts/directives/alert.item.list.html',
      scope: {
        widget: '='
      }
    }

  })

  .directive('filterCategory', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/shop/filter-popover/directives/filter.categories.html',
      scope: {
        categories: '=',
        click: '=',
        filter: '='
      },

    }

  });




