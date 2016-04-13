export default function($scope, $ionicPopover) {

  $scope.animation = 'slide-in-up';

  $ionicPopover.fromTemplateUrl('./src/settings/promo/directives/promo-popover.html', {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope.popover = popover;
    });

    $scope.openPopover = ($event)=>{
      $scope.popover.show($event);
    };

}
