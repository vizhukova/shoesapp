import ShowcaseCtrl from './showcase/controller'
import ProductCtrl from './product/controller'
import BrandsCtrl from './brands/controller'
import SearchCtrl from './search/controller'
import MeCtrl from './me/controller'
import LoginCtrl from './login/controller'
import MeSettingsCtrl from './settings/settings'
import MeSettingsPromoCtrl from './settings/promo/promo'
import MeSettingsShowMeCtrl from './settings/showMe/showMe'
import AlertCtrl from './alerts/controller'
import _ from 'lodash';

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  var deploy = new Ionic.Deploy();

  // Update app code with new release from Ionic Deploy
  $scope.doUpdate = function() {
    deploy.update().then(function(res) {
      console.log('Ionic Deploy: Update Success! ', res);
    }, function(err) {
      console.log('Ionic Deploy: Update error! ', err);
    }, function(prog) {
      console.log('Ionic Deploy: Progress... ', prog);
    });
  };

  // Check Ionic Deploy for new code
  $scope.checkForUpdates = function() {
    console.log('Ionic Deploy: Checking for updates');
    deploy.check().then(function(hasUpdate) {
      console.log('Ionic Deploy: Update available: ' + hasUpdate);
      $scope.hasUpdate = hasUpdate;
    }, function(err) {
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

.controller('BrandsFollowCtrl', function($scope, $state, $stateParams, Category, Brand){


  $scope.activeCat = {};

  $scope.$watch('activeCat', (newVal) => {
    $scope.activeCat = newVal;

    Category.get().then((data) => {
    $scope.cats = data;

     var filterBy = _.assign({}, {sectionId: $scope.activeCat.id}, $stateParams);

     Brand.getFiltered(filterBy).then((brands) => {
       $scope.brands = brands;
     });

  });

  });

   $scope.goToBrand = (brand_id) => {

    $state.go("tab.brand", {id: brand_id});

  };

   $scope.openProduct = (product, $event) => {
    $state.go('tab.shop-product', {id: product.id});

  };


})

// Search tab
.controller('SearchCtrl', SearchCtrl)

.controller('MeCtrl', MeCtrl)

.controller('MeSettingsPromoCtrl', MeSettingsPromoCtrl)

.controller('MeSettingsShowMeCtrl', MeSettingsShowMeCtrl)

.controller('MeSettingsCtrl', MeSettingsCtrl)

.controller('MeBrandsCtrl', function($scope){

  $scope.brandList = [1,1,1,1,1,1,1,1,1];

})

.controller('ShopCtrl', function($scope, $state, $ionicPopover, Category, Item, Brand) {

  Item.getFiltered({feature: 'sale'}).then((data) => {
    $scope.sales = {
      title: 'Sale',
      sale: true,
      items: data
    };
  });

  Item.getFiltered({feature: 'new'}).then((data) => {
    $scope.newArrivals = {
      title: 'New Arrivals',
      items: data
    };
  });

  Item.getFiltered({feature: 'popular'}).then((data) => {
    $scope.popular = {
      title: 'Popular',
      items: data
    };
  });

  Brand.getFullFiltered({feature: 'sale'}).then((data) => {
    $scope.brandSales = {
      title: 'Sale',
      sale: true,
      items: data
    };
    console.log('brandSales', data)
  });

  Brand.getFullFiltered({feature: 'new'}).then((data) => {
    $scope.brandNewArrivals = {
      title: 'New Arrivals',
      items: data
    };
  });

  Brand.getFullFiltered({feature: 'popular'}).then((data) => {
    $scope.brandPopular = {
      title: 'Popular',
      items: data
    };
  });

  Category.get().then((data) => {
    $scope.categories = data;
    console.log('categories', data)
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
    }).then((popover)=>{
      $scope.popover = popover;
    });

    $scope.openPopover = ($event)=>{
      $scope.popover.show($event);
    };

})

// Join header controller with join button
.controller('joinHeaderCtrl', function($scope, $ionicPopover) {

  $ionicPopover.fromTemplateUrl('./src/login/directives/signun.popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openSignupPopover = function($event) {
    $scope.popover.show($event);
  };

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('SearchPanelCtrl', function($scope) {

    $scope.isSearchOnFocus = false;

    $scope.onFocus = (e) => {

      $scope.isSearchOnFocus = true;

      if($scope.$parent.onFocus) {
        $scope.$parent.onFocus(e);
      }

    };

    $scope.onCancelClick = (e) => {

      $scope.isSearchOnFocus = false;

      if($scope.$parent.onCancelClick) {
        $scope.$parent.onCancelClick(e);
      }
    };

})

.controller('AlertCtrl', AlertCtrl)





