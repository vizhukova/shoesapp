import ShowcaseCtrl from './showcase/controller'

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

.controller('ShowcaseCtrl', ShowcaseCtrl)

.controller('ShopCtrl', function($scope, Category) {


  $scope.cats = Category.get();
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('CategoryContentCtrl', function($scope, $ionicPopover, $state,  Widgets) {


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
  Widgets.fetch('/man').then(data => {$scope.widgets = data})
});
