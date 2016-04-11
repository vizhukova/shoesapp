export default function($scope, $state, $ionicPopover) {
  $scope.animation = 'slide-in-up';

  var popups = [
    {name: 'signinPopover', url: 'src/login/directives/signin.popover.html'},
    {name: 'authPopover', url: 'src/shop/auth-popover.html'}
  ];

  popups.map((popup)=>{
    $ionicPopover.fromTemplateUrl(popup.url, {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope[popup.name] = popover;
    });

    $scope[`open${popup.name}`] = ($event)=>{
      $scope[popup.name].show($event);
    };
  })

  $scope.toShop = () => {
    $scope.signinPopover.hide();
    $state.go('tab.shop')
  };
}
