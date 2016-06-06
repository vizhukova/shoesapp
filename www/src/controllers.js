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

  .controller('StaticPageCtrl', function ($scope, $state, $stateParams, Settings) {

   Settings.getStaticPage($stateParams).then((data) => {
     $scope.page = data;
   })

  })

  .controller('ShopCtrl', function ($scope, $state, $ionicPopover, Category, Item, Brand, Banner) {

    $scope.categoryId;
    $scope.mainBanners = [];

    $scope.categoryService = Category;

    Category.get().then((data) => {
      $scope.categories = data;
    });

     $scope.$watch('categoryService.getActive()', (newVal) => {

      if(newVal) {

        $scope.categoryId = newVal.id;

        Banner.getLogin().then((data) => {
          $scope.mainBanners = data;
          $scope.$digest();
        });

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

      }

    });

    $scope.goToAlerts = () => {
      $state.go('tab.alerts');
    };

    $scope.goToProducts = (param) => {
      $scope.popover.hide();
      $state.go($state.go("tab.shop-products", param));
    };

    $scope.goToBrand = (brand_id) => {
      $state.go("tab.brand", {id: brand_id});
    };

    $scope.goToBrands = (param) => {
      $state.go("tab.brand-follow", param)
    };

    $ionicPopover.fromTemplateUrl('src/shop/category-popover.html', {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=> {
      $scope.popover = popover;
    });

    $scope.openPopover = ($event)=> {

      $scope.popover.show($event);

      Category.getArrayTree( $scope.categoryId).then((data) => {
        $scope.subCategories = data[0].items;
      })

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

      if ($scope.$parent.onCancelClick) {
        $scope.$parent.onCancelClick($event);
      }
    };

    $scope.search = ($event) => {
      $event.stopPropagation();
      $state.go($state.go("tab.search-products", {q: $scope.searchStr}));
    }

  })

  .controller('MainController', function ($scope, $state, $rootScope) {

    var options = {
      'brands': 'tab.brands',
      'shop': 'tab.shop',
      'search': 'tab.search',
      'me': 'tab.me'
    }

    $scope.deselect = (option) => $state.go(options[option]);

    $scope.isShowButton = false;

    $scope.updateLikedBrands = () => {

      $rootScope.updateLikedBrands();

    };

    $rootScope.showDoneButton = (data) => {

      $scope.isShowButton = data;

    };


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







