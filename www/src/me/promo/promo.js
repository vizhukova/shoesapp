export default function($scope, $ionicPopover) {

  $scope.animation = 'slide-in-up';

  $scope.focus = false;

  $ionicPopover.fromTemplateUrl('./src/settings/promo/directives/promo-popover.html', {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope.popover = popover;
    });

    $scope.openPopover = ($event)=>{
      $scope.focus = true;
      $scope.popover.show($event);
    };


  $scope.isFocus = () => $scope.focus;

  $scope.$on('popover.hidden', function() {
    $scope.focus = false;
  });
}
