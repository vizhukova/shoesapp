import ShowcaseCtrl from './showcase/controller'
import ProductCtrl from './product/controller'
import BrandsCtrl from './brands/controller'
import SearchCtrl from './search/controller'
import MeCtrl from './me/controller'
import LoginCtrl from './login/controller'
import MeSettingsCtrl from './settings/settings'
import MeSettingsPromoCtrl from './settings/promo/promo'
import MeSettingsShowMeCtrl from './settings/showMe/showMe'

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

// Search tab
.controller('SearchCtrl', SearchCtrl)

.controller('MeCtrl', MeCtrl)

.controller('MeSettingsPromoCtrl', MeSettingsPromoCtrl)

.controller('MeSettingsShowMeCtrl', MeSettingsShowMeCtrl)

.controller('MeSettingsCtrl', MeSettingsCtrl)

.controller('MeBrandsCtrl', function($scope){

  $scope.brandList = [1,1,1,1,1,1,1,1,1];

})

.controller('ShopCtrl', function($scope, $state, Category) {

  $scope.products = [1, 2, 3,4 ,5 ,6, 7, 8,9, 0];

  $scope.goToAlerts = () => {
    $state.go('tab.alerts');
  };

  $scope.goToAlert = () => {
    $state.go('tab.alert');
  };

  Category.get().then((data) => {

    $scope.cats = data;

  })
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

.controller('CategoryContentCtrl', function($scope, $ionicPopover, $state,  Content, Category) {

  Category.get().then((data) => {

    $scope.cats = data;

  });

  Content.get().then((data) => {
    $scope.items = data;
  });

  $ionicPopover.fromTemplateUrl('./src/shop/category-popover.html', {

    scope: $scope

  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };


  $scope.toShowcase = () => {

    $scope.popover.hide();
    $state.go("tab.showcase")

  };

    // Call Widget service method to
    // fetch data by current category

  Content.get().then((data) => {console.log(data);$scope.items = {title: 'title', items: data}})
})



