import _ from 'lodash';

angular.module('starter.directives', [])

  .directive('categories', function (Category, $timeout) {

    return {
      restrict: 'E',
      scope: {
        cats: '='
      },
      replace: true,
      templateUrl: './src/shop/category.html',
      link: (scope) => {

        var underline;
        var item;
        var container;

        scope.$watch('cats', (newVal, oldVal) => {

          // Get categories [...] from Category service
          if (newVal && newVal.length) {

            underline = $('.active-line');
            item = $('.cat-item');
            container = $('.categories');

            if(!Category.getActive()) $(underline).css({left: 0});

            var width = $(document).width() / newVal.length;
            width = width > 150 ? 150 : width;


            item.width(width);

            var activeCat = Category.getActive();

            scope.setActive(_.findIndex(scope.cats, activeCat) || 0);
          }

        });

        // Animate navigation menu underline
        var animate = (index) => {

          $(underline).css('left', $(item.get(index)).position().left + 'px');
          $(underline).width($(item.get(index)).width());

        };

        // Set active category
        scope.setActive = (index) => {
          scope.activeCat = scope.cats[index].id;
          Category.setActive(scope.cats[index]);
          animate(index);
        };

        // Set active class for category navigation menu
        scope.isActive = (index) => {
          return scope.cats[index].id === scope.activeCat;
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

  .directive('likedSlider', function ($rootScope) {

    return {
      scope: {
        widget: '=',
        titleClick: '=',
        titleClickParam: '='
      },
      restrict: 'E',
      replace: true,
      templateUrl: './src/shop/liked.slider.html',
      controller: 'ShowcaseCtrl',

      link: (scope, element, attrs) => {

        // Width of scrollable area depend on count items
        scope.$watch('widget', function (newValue, oldValue) {
          if (newValue && newValue.items) {
            scope.width = (1 + newValue.items.length) * 11 + 1 + 'em';
          }
        });


        scope.declension = (num) => {
          return $rootScope.declension(num, ['товар', 'товара', 'товаров']);
        }

      }
    }
  })

  .directive('gallerySlider', function ($timeout) {

    return {
      scope: {
        widget: '=',
        titleClick: '=',
        itemClick: '=',
        titleClickParam: '='
      },
      restrict: 'E',
      replace: true,
      templateUrl: './src/shop/gallery.slider.html',
      link: (scope, element, attrs) => {

        var elem = element;

        scope.callback = () => {

           scope.$watch('widget', (newVal, oldVal) => {
            if (newVal) {
              $timeout(() => {

                var mySwiper = new Swiper($(elem).find('.swiper-container'), {
                  // Optional parameters
                  direction: 'horizontal',
                  slidesPerView: 'auto',
                  centeredSlides: true,
                  spaceBetween: 7,
                  loop: true
                })
              });
            }

          });
        };

      }
    }
  })

  .directive('bigSlider', function ($timeout) {

    return {
      scope: {
        imgs: '=',
        autoplay: '='
      },
      restrict: 'E',
      replace: true,
      templateUrl: './src/shop/big.slider.html',
      link: (scope, element, attrs) => {

        scope.$watch('imgs', (newVal, oldVal) => {

          if (newVal && newVal.length > 0) {
            $timeout(() => {

              var mySwiper = new Swiper($(element).find('.swiper-container'), {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                loop: true
              })

            })

          }

        });
      //
      //  function getSlideDataIndex(swipe){
      //    var activeIndex = swipe.activeIndex;
      //    var slidesLen = swipe.slides.length;
      //    if(swipe.params.loop){
      //        switch(swipe.activeIndex){
      //            case 0:
      //                activeIndex = slidesLen-3;
      //                break;
      //            case slidesLen-1:
      //                activeIndex = 0;
      //                break;
      //            default:
      //                --activeIndex;
      //        }
      //    }
      //    return  activeIndex;
      //}


      }
    }
  })

  .directive('bannerSlider', function ($timeout, $state) {

    return {
      scope: {
        imgs: '=',
        autoplay: '=',
        isclickable: '='
      },
      restrict: 'E',
      replace: true,
      templateUrl: './src/shop/banner.slider.html',
      link: (scope, element, attrs) => {

        var isReady = false;

        scope.$watch('imgs', (newVal, oldVal) => {

          if (newVal && newVal.length > 0) {

            $timeout(() => {
              var mySwiper = new Swiper($(element).find('.swiper-container'), {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                loop: true
              })
            });

            $timeout(() => {
              isReady = true;
            }, 800);

          }

        });


        scope.click = (item) => {
          if(scope.isclickable) {
            $state.go('tab.shop-products', item);
          }
        };

        scope.ready = () => {
          return isReady;
        };


      //  function getSlideDataIndex(swipe){
      //    var activeIndex = swipe.activeIndex;
      //    var slidesLen = swipe.slides.length;
      //    if(swipe.params.loop){
      //        switch(swipe.activeIndex){
      //            case 0:
      //                activeIndex = slidesLen-3;
      //                break;
      //            case slidesLen-1:
      //                activeIndex = 0;
      //                break;
      //            default:
      //                --activeIndex;
      //        }
      //    }
      //    return  activeIndex;
      //}


      }
    }
  })

  .directive('fullScreenSlider', function ($timeout, $state) {

    return {
      scope: {
        imgs: '=',
        autoplay: '=',
        isclickable: '='
      },
      restrict: 'E',
      replace: true,
      templateUrl: './src/shop/full.screen.slider.html',
      link: (scope, element, attrs) => {

        var isReady = false;

        scope.$watch('imgs', (newVal, oldVal) => {

          if (newVal && newVal.length > 0) {

            $timeout(() => {
              var mySwiper = new Swiper($(element).find('.swiper-container'), {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                loop: true
              })
            });

            $timeout(() => {
              isReady = true;
            }, 800);

          }

        });


        scope.click = (item) => {
          if(scope.isclickable) {
            $state.go('tab.shop-products', item);
          }
        };

        scope.ready = () => {
          return isReady;
        };


      //  function getSlideDataIndex(swipe){
      //    var activeIndex = swipe.activeIndex;
      //    var slidesLen = swipe.slides.length;
      //    if(swipe.params.loop){
      //        switch(swipe.activeIndex){
      //            case 0:
      //                activeIndex = slidesLen-3;
      //                break;
      //            case slidesLen-1:
      //                activeIndex = 0;
      //                break;
      //            default:
      //                --activeIndex;
      //        }
      //    }
      //    return  activeIndex;
      //}


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
      replace: true,
      scope: {
        products: '='
      }
    }
  })
  //Product item in showcase
  .directive('product', function () {

    return {
      restrict: 'E',
      templateUrl: './src/showcase/directives/templates/product.html',
      controller: 'ShowcaseCtrl',
      scope: true,
      replace: true
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

  .directive('imageLoader', function ($sce, $timeout, Server) {

    return {
      restrict: 'E',
      templateUrl: './src/partial/image-loader.html',
      replace: true,
      scope: {
        width: '@',
        height: '@',
        source: '@',
        classname: '@',
        defaultpic: '@',
        callback: '='
      },
      link: function (scope, element, attributes) {

        scope.isNotLoaded = () => {
          return scope.isLoaded === false;
        };

        //$timeout(() => {
          scope.isLoaded = false;
          console.log(scope.defaultpic)

        function PreLoadImage(objSettings, callback) {

          var thePic = new Image();
          thePic.src = $sce.trustAsResourceUrl(scope.source);

          //Server.fetch(scope.source).then(() => {
          //  scope.isLoaded = true;
          //});

          thePic.onload = function () {
            callback();
            console.log('uploaded')
          };

          thePic.onerror = function (err) {
            scope.source = scope.defaultpic;
            callback();
            console.error('Error load image in PreLoadImage', err)
          };

          //thePic.src = objSettings.src;
        }

          PreLoadImage(scope, ()=> {
            scope.isLoaded = true;
            scope.$digest();


            if(scope.callback) {
              scope.callback();
            }

          });
        //})

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

  .directive('buyProduct', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: './src/product/directives/buy.product.html',
      scope: {
        item: '=',
        brand: '='
      },
      controller: 'ProductCtrl'
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

  .directive('productRecommend', function ($rootScope) {

    //return {
    //  scope: {
    //    widget: '=',
    //    click: '=',
    //    paramstoclick: '='
    //  },
    //  restrict: 'E',
    //  replace: true,
    //  templateUrl: './src/brands/directives/product.recommend.html',
    //  controller: 'ShowcaseCtrl',
    //
    //  link: (scope, element, attrs) => {
    //
    //    // Width of scrollable area depend on count items
    //    scope.$watch('widget', function (newValue, oldValue) {
    //      if (newValue && newValue.items) {
    //        scope.width = (1 + newValue.items.length) * 11 + 1 + 'em';
    //      }
    //    });
    //
    //
    //    scope.declension = (num) => {
    //      return $rootScope.declension(num, ['товар', 'товара', 'товаров']);
    //    }
    //
    //  }
    //}

    return {
      scope: {
        widget: '=',
        titleClick: '=',
        titleClickParam: '='
      },
      restrict: 'E',
      replace: true,
      templateUrl: './src/brands/directives/product.recommend.html',
      controller: 'ShowcaseCtrl',

      link: (scope, element, attrs) => {

        // Width of scrollable area depend on count items
        scope.$watch('widget', function (newValue, oldValue) {
          if (newValue && newValue.items) {
            scope.width = (1 + newValue.items.length) * 11 + 1 + 'em';
          }
        });


        scope.click =  () => {

          scope.titleClick(scope.widget.id, scope.titleClickParam);

        };


        scope.declension = (num) => {
          return $rootScope.declension(num, ['товар', 'товара', 'товаров']);
        }

      }
    }
  })

  .directive('brandFollow', function ($timeout) {

    return {
      restrict: 'E',
      //replace: true,
      templateUrl: './src/brands/directives/brand.follow.html',
      controller: 'FollowPageCtrl',
      scope: {
        widget: '='
      },

      link: (scope, element, attrs) => {

        scope.$watch('widget', (newVal, oldVal) => {

          $timeout(function() {

            if (newVal && newVal.items) {
              scope.width = (1 + scope.widget.items.length) * 11 + 1 + 'em';
            }

          })

        });

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
        scope.$watch('items', (newVal) => {
          if (newVal) scope.width = (1 + newVal.length) * 5 + 1 + 'em';
        })
      }
    }
  })

  .directive('brandBlock', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: './src/brands/directives/brand.block.html',
      scope: true
    }
  })

  .directive('productsPage', function () {

    return {
      restrict: 'E',
      templateUrl: './src/productsPage/template.html',
      controller: 'ProductsPageCtrl'

    }
  })

  .directive('searchPanel', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: './src/partial/search.panel.html',
      scope: {
        placeholder: '='
      },
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
      templateUrl: 'src/productsPage/filter-popover/directives/filter.categories.html',
      scope: {
        categories: '=',
        click: '=',
        close: '=',
        filter: '='
      },

      link: (scope) => {

        scope.$watch('categories', (newVal, oldVal) => {
          if (newVal) {
            scope.height = (newVal.countItems || newVal.length) * 43 + 'px';
            console.log('HEIGHT', scope.height)
          }
        })

      }

    }

  })

  .directive('filterSize', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/productsPage/filter-popover/directives/filter.sizes.html',
      scope: {
        sizes: '=',
        click: '=',
        filter: '='
      },

      link: (scope) => {

        scope.$watch('sizes', (newVal, oldVal) => {
          if (newVal) {
            scope.height = (newVal.length) * 43 + 'px';
            console.log('HEIGHT', scope.height)
          }
        })

      }

    }

  })

  .directive('filterColor', function () {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/productsPage/filter-popover/directives/filter.colors.html',
      scope: {
        colors: '=',
        click: '=',
        filter: '='
      },

      link: (scope) => {

        scope.$watch('colors', (newVal, oldVal) => {
          if (newVal) {
            scope.height = (newVal.length) * 43 + 'px';
            console.log('HEIGHT', scope.height)
          }
        })

      }

    }

  })

  .directive('back', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/partial/back.html',

      link: (scope) => {

        scope.click = () => {
          history.back();
        }

      }

    }
  })

  .directive('smallFollowBrand', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/brands/directives/brand.small.icon.follow.html',
      controller: 'SmallFollowBrandCtrl',
      scope: {
        brands: '='
      }
    }
  })

  .directive('login', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/login/directives/login.template.html',
      controller: 'LoginCtrl',
      scope: {
        callback: '='
      }
    }
  })

  .directive('missSomething', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/login/directives/miss.something.html',
      controller: 'LoginCtrl',
      scope: {}
    }
  })

  .directive('categoryBar', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'src/partial/category.bar.html',
      controller: 'CategoryBarCtrl',
      scope: {
        click: '='
      }
    }
  })

  .directive('input', function () {
    return {
      restrict: 'E',
      scope: {
        nIonic: '='
      },
      link: function(scope, element, attr) {
        if(scope.nIonic) {
          element.bind('touched touchmove touchstart', function(e) {
            e.stopPropagation();
          })
        }
      }
    }
  })






