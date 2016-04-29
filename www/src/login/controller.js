export default function($scope, $state, $ionicPopover, User) {

  $scope.animation = 'slide-in-up';
  $scope.recovery = false;
  $scope.user = {};

  var popups = [
    {name: 'signinPopover', url: 'src/login/directives/signin.popover.html'},
    {name: 'signunPopover', url: 'src/login/directives/signun.popover.html'}
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
      $scope.user = {};
    };

    $scope[`close${popup.name}`] = ()=>{
      $scope.closeRecovery();
      $scope[popup.name].hide();
    };
  });

  $scope.openRecovery = () => {
    $scope.recovery = true;
    $scope.user = {};
  };

  $scope.closeRecovery = () => {
    $scope.recovery = false;
    $scope.user = {};
  };

  $scope.toShop = () => {
    $scope.signinPopover.hide();
    $scope.signunPopover.hide();
    $state.go('tab.shop')
  };


  $scope.signIn = function() {

    User.signIn($scope.user)

  };

  $scope.signUp = function() {

    User.signUp($scope.user)

  };

  $scope.forgotPassword = function() {

    User.forgotPassword($scope.user)

  };
}
