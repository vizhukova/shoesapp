// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

require('angular-local-storage');

angular.module('starter', [
  'ionic',
  'ionic.service.core',
  'starter.controllers',
  'starter.services',
  'starter.directives',
  'starter.config',
  'jett.ionic.scroll.sista',
  'LocalStorageModule'
])

  .constant('_', window._)

  .run(function ($rootScope) {
     $rootScope._ = window._;
  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom').style('standart');
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.navBar.alignTitle('center');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'src/login/template.html',
        controller: 'LoginCtrl'
      })

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.shop', {
        url: '/shop',
        cache: false,
        views: {
          'tab-shop': {
            templateUrl: 'templates/tab-shop.html',
            controller: 'ShopCtrl'
          }
        }
      })

      .state('tab.shop-product', {
        url: '/shop/product/:id',
        cache: false,
        views: {
          'tab-shop': {
            templateUrl: 'src/product/template.html',
            controller: 'ProductCtrl'
          }
        }
      })

      .state('tab.shop-products', {
        url: '/shop/products/?feature&sectionId',
        cache: false,
        views: {
          'tab-shop': {
            templateUrl: 'src/brands/tabs/brand.products.html',
            controller: 'ProductsPageCtrl'
          }
        }
      })

      .state('tab.showcase', {
        url: '/showcase',
        cache: false,
        views: {
          'tab-shop': {
            templateUrl: 'templates/subtab-showcase.html',
            controller: 'ShowcaseCtrl'
          }
        }
      })

      .state('tab.product', {
        url: '/product/:id',
        cache: false,
        views: {
          'tab-shop': {
            templateUrl: 'src/product/template.html',
            controller: 'ProductCtrl'
          }
        }
      })

      .state('tab.brands', {
        url: '/brands',
        cache: false,
        views: {
          'tab-brands': {
            templateUrl: 'src/brands/tabs/brand.main.page.html',
            controller: 'BrandsCtrl'
          }
        }
      })

      .state('tab.brand', {
        url: '/brand/:id',
        cache: false,
        views: {
          'tab-brands': {
            templateUrl: 'src/brands/tabs/brand.page.html',
            controller: 'ItemPageCtrl'
          }
        }
      })

      .state('tab.brand-products', {
        url: '/brands/products/?feature&sectionId&brandId',
        cache: false,
        views: {
          'tab-brands': {
            templateUrl: 'src/brands/tabs/brand.products.html',
            controller: 'ProductsPageCtrl'
          }
        }
      })

      //.state('tab.brand-product', {
      //  url: '/brand/:brand_id/product/:product_id',
      //  views: {
      //    'tab-brands': {
      //      templateUrl: 'src/product/template.html',
      //      controller: 'ProductCtrl'
      //    }
      //  }
      //})

      .state('tab.brand-follow', {
        url: '/brand/follow/?feature',
        cache: false,
        views: {
          'tab-brands': {
            templateUrl: 'src/brands/subtabs/brand-follow-page.html',
            controller: 'FollowPageCtrl'
          }
        }
      })

      .state('tab.search', {
        url: '/search',
        cache: false,
        views: {
          'tab-search': {
            templateUrl: 'src/search/template.html',
            controller: 'SearchCtrl'
          }
        }
      })

      .state('tab.search-products', {
        url: '/search/products/?q',
        cache: false,
        views: {
          'tab-search': {
            templateUrl: 'src/search/tabs/search.products.html',
            controller: 'SearchProductsCtrl'
          }
        }
      })

      .state('tab.me', {
        url: '/me',
        cache: false,
        views: {
          'tab-me': {
            templateUrl: 'templates/tab-me.html',
            controller: 'MeCtrl'
          }
        }
      })

      .state('tab.me-settings', {
        url: '/me/settings',
        cache: false,
        views: {
          'tab-me': {
            templateUrl: './src/me/tabs/settings.html',
            controller: 'MeSettingsCtrl'
          }
        }
      })

      .state('tab.me-settings-promo', {
        url: '/me/settings/promo',
        cache: false,
        views: {
          'tab-me': {
            templateUrl: 'src/settings/promo/template.html',
            controller: 'MeSettingsPromoCtrl'
          }
        }
      })

      .state('tab.me-settings-showMe', {
        url: '/me/settings/show_me',
        cache: false,
        views: {
          'tab-me': {
            templateUrl: 'src/settings/showMe/template.html',
            controller: 'MeSettingsShowMeCtrl'
          }
        }
      })

      .state('tab.me-static-page', {
        url: '/me/settings/:id',
        views: {
          'tab-me': {
            templateUrl: 'src/settings/directives/staticPage.html',
            controller: 'StaticPageCtrl'
          }
        }
      })

      .state('tab.me-brands', {
        url: '/me/brands',
        cache: false,
        views: {
          'tab-me': {
            templateUrl: './src/me/tabs/brand-list.html',
            controller: 'MeBrandsCtrl'
          }
        }
      })

      .state('tab.me-orders', {
        url: '/me/orders',
        cache: false,
        views: {
          'tab-me': {
            templateUrl: './src/me/tabs/order-list.html',
            controller: 'MeCtrl'
          }
        }
      })

      .state('tab.alerts', {
        url: '/alert',
        cache: false,
        views: {
          'tab-shop': {
            templateUrl: 'src/alerts/template.html',
            controller: 'AlertCtrl'
          }
        }
      })

      .state('tab.alert', {
        url: '/alert/:id',
        cache: false,
        views: {
          'tab-shop': {
            templateUrl: 'src/alerts/directives/alert.item.html',
            controller: 'AlertCtrl'
          }
        }
      })


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
