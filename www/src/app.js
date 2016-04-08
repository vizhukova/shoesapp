// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'starter.services', 'starter.directives', 'starter.config'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom').style('standart');
  $ionicConfigProvider.scrolling.jsScrolling(false);
  $ionicConfigProvider.navBar.alignTitle('center');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.shop', {
    url: '/shop',
    views: {
      'tab-shop': {
        templateUrl: 'templates/tab-shop.html',
        controller: 'ShopCtrl'
      }
    }
  })
  .state('tab.showcase', {
    url: '/showcase',
    views: {
      'tab-shop': {
        templateUrl: 'templates/subtab-showcase.html',
        controller: 'ShowcaseCtrl'
      }
    }
  })
    .state('tab.product', {
      url: '/product/:id',
      views: {
        'tab-shop': {
          templateUrl: 'src/product/template.html',
          controller: 'ProductCtrl'
        }
      }
    })

  .state('tab.brands', {
      url: '/brands',
      views: {
        'tab-brands': {
          templateUrl: 'src/brands/template.html',
          controller: 'BrandsCtrl'
        }
      }
    })
      .state('tab.brand', {
        url: '/brand/:id',
        views: {
          'tab-brands': {
            templateUrl: 'src/brands/subtabs/brand.html'
          }
        }
      })

  .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'src/search/template.html',
          controller: 'SearchCtrl'
        }
      }
    })

  .state('tab.me', {
    url: '/me',
    views: {
      'tab-me': {
        templateUrl: 'templates/tab-me.html',
        controller: 'MeCtrl'
      }
    }
  })

  .state('tab.me-settings', {
    url: '/me/settings',
    views: {
      'tab-me': {
        templateUrl: 'templates/me/settings.html',
        controller: 'MeSettingsCtrl'
      }
    }
  })

  .state('tab.me-brands', {
    url: '/me/brands',
    views: {
      'tab-me': {
        templateUrl: 'templates/me/brand-list.html',
        controller: 'MeBrandsCtrl'
      }
    }
  })

  .state('tab.me-orders', {
    url: '/me/orders',
    views: {
      'tab-me': {
        templateUrl: 'templates/me/order-list.html',
        controller: 'MeCtrl'
      }
    }
  });



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/shop');

});
