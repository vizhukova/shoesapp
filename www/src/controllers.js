import ShowcaseCtrl from './showcase/controller'
import ProductCtrl from './product/controller'
import BrandsCtrl from './brands/MainPageCtrl'
import FollowPageCtrl from './brands/FollowPageCtrl'
import ItemPageCtrl from './brands/ItemPageCtrl'
import SearchCtrl from './search/controller'
import MeCtrl from './me/MeCtrl'
import LoginCtrl from './login/controller'
import MeSettingsCtrl from './me/SettingsCtrl'
import MeSettingsPromoCtrl from './me/promo/promo'
import MeSettingsShowMeCtrl from './me/showMe/showMe'
import AlertCtrl from './alerts/controller'
import ProductsPageCtrl from './productsPage/controller'
import OrderCtrl from './order/controller'
import _ from 'lodash';

angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {
    var deploy = new Ionic.Deploy();

    // Update app code with new release from Ionic Deploy
    $scope.doUpdate = function () {
      deploy.update().then(function (res) {
        console.log('Ionic Deploy: Update Success! ', res);
      }, function (err) {
        console.log('Ionic Deploy: Update error! ', err);
      }, function (prog) {
        console.log('Ionic Deploy: Progress... ', prog);
      });
    };

    // Check Ionic Deploy for new code
    $scope.checkForUpdates = function () {
      console.log('Ionic Deploy: Checking for updates');
      deploy.check().then(function (hasUpdate) {
        console.log('Ionic Deploy: Update available: ' + hasUpdate);
        $scope.hasUpdate = hasUpdate;
      }, function (err) {
        console.error('Ionic Deploy: Unable to check for updates', err);
      });
    }
  })

  // Login page
  .controller('LoginCtrl', LoginCtrl)

  .controller('ShowcaseCtrl', ShowcaseCtrl)
  // Product in showcase
  .controller('ProductCtrl', ProductCtrl)

  .controller('productCtrl', ProductCtrl)
  // Product subtab

  // Brands tab
  .controller('BrandsCtrl', BrandsCtrl)

  .controller('FollowPageCtrl', FollowPageCtrl)

  .controller('OrderCtrl', OrderCtrl)

  .controller('ItemPageCtrl', ItemPageCtrl)

  // Search tab
  .controller('SearchCtrl', SearchCtrl)

  .controller('MeCtrl', MeCtrl)

  .controller('MeSettingsPromoCtrl', MeSettingsPromoCtrl)

  .controller('MeSettingsShowMeCtrl', MeSettingsShowMeCtrl)

  .controller('MeSettingsCtrl', MeSettingsCtrl)

  .controller('MeBrandsCtrl', function ($scope, $state, Brand) {

    Brand.getLiked().then((data) => {
      $scope.likedBrands = data;
      console.log(data)
      $scope.$digest();
    });

  })

  .controller('StaticPageCtrl', function ($scope, $state, $timeout, $stateParams, Settings) {

   Settings.getStaticPage($stateParams).then((data) => {
     $timeout(function() {
       $scope.page = data;
     });
   })

  })

  .controller('ShopCtrl', function ($scope, $state, $ionicPopover, $ionicScrollDelegate, Category, Item, Brand, Banner, Info, Settings) {

    $scope.categoryId;
    $scope.categoryService = Category;
    $scope.settingsService = Settings;
    $scope.isMainScrollOn = false;
    $scope.allowScroll = false;

    // onMainScroll();

    $scope.ready = () => {

      return $scope.categories && $scope.mainBanners && $scope.sales &&  $scope.newArrivals
        && $scope.popular && $scope.brandSales &&  $scope.brandNewArrivals &&  $scope.brandPopular;

    };

    var mainScroll = $('#MainScroll');
    var contentScroll = $('#ContentScroll');

    $('.bannerSlider').bind('touchstart', function() {
      console.log('!!!!!!! bannerSlider touchstart !!!!!!!!!!!!');
    });

    $('.bannerSlider').bind('touchend', function() {
      console.log('!!!!!!! bannerSlider touchend !!!!!!!!!!!!');
    });

    mainScroll.bind('scroll', function() {
      console.log('main scroll')
      if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
          offMainScroll();
      }
    });

    contentScroll.bind('scroll', function() {

       console.log('content scroll')
      console.log('scrollTop ==', $(this).scrollTop())
      if($(this).scrollTop() <= 5) {
       onMainScroll();
      }

    });


    function onMainScroll () {

      if(! $scope.isLogIn) {
        mainScroll.css('overflow-y', 'auto');
        contentScroll.css('overflow-y', 'hidden');
        // $ionicScrollDelegate.$getByHandle('MainScroll').scrollTop(true);
        mainScroll.scrollTop(0);
      }

    }

    function offMainScroll () {
      if(! $scope.isLogIn) {
        mainScroll.css('overflow-y', 'hidden');
        contentScroll.css('overflow-y', 'auto');
      }
    }

    $scope.isLogIn = Settings.isLogIn();

    if($scope.isLogIn) {
      offMainScroll();
    } else {
      onMainScroll();
    }

    Info.get().then((info) => {
      $scope.info = info;
    });

    Category.get().then((data) => {
      $scope.categories = data;
      $scope.$digest();
    });

    $scope.$watch('settingsService.isLogIn()', (newVal) => {
      if(newVal) {
        offMainScroll();
        $scope.isLogIn = newVal;
        console.log('isLogon watcher');
      }
    });

     $scope.$watch('categoryService.getActive()', (newVal) => {

      if(newVal) {

        $scope.categoryId = newVal.id;

        Category.getArrayTree( $scope.categoryId).then((data) => {
            $scope.subCategories = data[0].items;
        })

        Banner.getMain().then((data) => {

          $scope.mainBanners = data;
          $scope.$digest();

        }).then(() => {

          Item.getFiltered({feature: 'sale', sectionId: $scope.categoryId}).then((data) => {
          $scope.sales = {
            title: 'Распродажа',
            sale: true,
            items: data
          };

          $scope.$digest();
        });

        Item.getFiltered({feature: 'new', sectionId: $scope.categoryId}).then((data) => {
          $scope.newArrivals = {
            title: 'Новые поступления',
            items: data
          };

          $scope.$digest();
        });

        Item.getFiltered({feature: 'popular', sectionId: $scope.categoryId}).then((data) => {
          $scope.popular = {
            title: 'Популярные',
            items: data
          };

          $scope.$digest();
        });

        Brand.getFiltered({feature: 'sale', sectionId: $scope.categoryId}).then((data) => {

          $scope.brandSales = {
            title: 'Распродажа',
            sale: true,
            items: data
          };
          $scope.$digest();
          console.log('brandSales', data)
        });

        Brand.getFiltered({feature: 'new', sectionId: $scope.categoryId}).then((data) => {

          $scope.brandNewArrivals = {
            title: 'Новые поступления',
            items: data
          };
          $scope.$digest();
        });

        Brand.getFiltered({feature: 'popular', sectionId: $scope.categoryId}).then((data) => {

          $scope.brandPopular = {
            title: 'Популярные',
            items: data
          };
          $scope.$digest();
        });

        })

      }

    });

    $scope.goToAlerts = () => {
      $state.go('tab.alerts');
    };

    $scope.goToProducts = (param) => {
      $scope.popover.hide();
      $state.go("tab.shop-products", _.assign({}, param, {sectionId: $scope.categoryId}));
    };

    $scope.goToBrand = (brand_id) => {
      $state.go("tab.brand", {id: brand_id});
    };

    $scope.goToBrands = (param) => {
      $state.go("tab.brand-follow", param);
    };

    $ionicPopover.fromTemplateUrl('src/shop/category-popover.html', {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=> {
      $scope.popover = popover;
    });

    $scope.openPopover = ($event)=> {

      $scope.popover.show($event);

    };

  })

  // Join header controller with join button
  .controller('joinHeaderCtrl', function ($scope, $ionicPopover) {

    $ionicPopover.fromTemplateUrl('./src/login/directives/signun.popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.openSignupPopover = function ($event) {
      $scope.popover.show($event);
    };

  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  })

  .controller('SearchPanelCtrl', function ($scope, $state) {

    $scope.searchStr = '';
    $scope.isSearchOnFocus = false;
    $scope.placeholder = $scope.placeholder || "Поиск товаров для покупки";

    $scope.onFocus = ($event) => {

      $event.stopPropagation();

      $scope.isSearchOnFocus = true;

      if ($scope.$parent.onFocus) {
        $scope.$parent.onFocus($event);
      }

    };

    $scope.onCancelClick = ($event) => {

      $event.stopPropagation();

      $scope.isSearchOnFocus = false;
      $scope.searchStr = '';

      if ($scope.$parent.onCancelClick) {
        $scope.$parent.onCancelClick($event);
      }
    };

    $scope.search = ($event) => {
      $event.stopPropagation();
      $state.go($state.go("tab.search-products", {q: $scope.searchStr}));
    }

  })

  .controller('MainController', function ($scope, $state, $rootScope, $timeout, Main) {

    var options = {
      'brands': 'tab.brands',
      'shop': 'tab.shop',
      'search': 'tab.search',
      'me': 'tab.me'
    };

    $scope.bodyClass = '';

    $scope.mainService = Main;

    $scope.$watch('mainService.isFollowButton()', (newVal) => {
      $scope.isFollowButton = $state.is('tab.shop-product' || 'tab.product') && newVal;
      console.log('mainService', newVal)
    });

    $scope.$watch('mainService.getNavVisible()', (newVal) => {
      $scope.isNavVisible = newVal;
    });

    //$scope.isProductTab = () => {
    //    return $state.is('tab.shop-product' || 'tab.product') && Main.isFollowButton();
    //};

    $scope.deselect = (option) => {
      if($scope.isNavVisible) {
        $state.go(options[option]);
      }
    };

    $scope.isShowButton = false;

    $scope.updateLikedBrands = () => {

      $rootScope.updateLikedBrands();

    };

    $rootScope.showDoneButton = (data) => {

      $scope.isShowButton = data;

    };

    $('body').on('touchmove', () => {
      window.dragable = true;
    })

    $('body').on('touchstart', () => {
      window.dragable = false;
    })

$('body').on('touchmend', (e) => {
  if(window.dragable) e.preventDefault();
})

  })

  .controller('SmallFollowBrandCtrl', function ($scope, $state, Brand) {

    $scope.follow = (brand, $event) => {

      $event.stopPropagation();

      if (brand.isLiked) {

        Brand.removeLiked(brand.id);
        brand.isLiked = false;

      } else {

        Brand.addLiked(brand.id);
        brand.isLiked = true;

      }
    };

    $scope.goToBrand = (brand_id) => {

      $state.go("tab.brand", {id: brand_id});

    };

  })

  .controller('AlertCtrl', AlertCtrl)

  .controller('ProductsPageCtrl', ProductsPageCtrl)

  .controller('CategoryBarCtrl', function ($scope, $state, Category) {

    $scope.$watch('categoryService.getActive()', (newVal, oldVal) => {

      $scope.categoryService = Category;

      $scope.click = $scope.click || $scope.toProducts;

    if(newVal && newVal.id) {

      return Category.getArrayTree(newVal.id).then((cats) => {
        $scope.categories = cats;
        console.log('categoryTree', cats)
        $scope.$digest();
      });

    }

    $scope.toProducts = (id) => {

      $state.go("tab.brand-products", {sectionId: id});

    };
  });

  })







