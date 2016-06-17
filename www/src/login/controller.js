export default function($scope, $state, $ionicPopover, $ionicModal, User, Banner, Info) {

  $scope.animation = 'slide-in-up';
  $scope.recovery = false;
  $scope.user = {};
  var isFocused  = false;

  var isDisableButton = false;

  Banner.getLogin().then((data) => {
    $scope.banners = data;
  });

  Info.get().then((info) => {
    $scope.info = info;
  });


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

  });

   $scope[`opensigninPopover`] = ($event)=>{
     isFocused = true;
     $scope[`signinPopover`].show($event);
     $scope.closeRecovery();
   };

  $scope[`opensignunPopover`] = ($event)=>{
     $scope[`signunPopover`].show($event);
     $scope.closeRecovery();
   };

  $scope.openerrorModal = () => {

    $ionicModal.fromTemplateUrl('./src/login/directives/error.modal.html', {
      scope: $scope
    }).then(function(modal) {

      $scope.errorModal = modal;

      $scope.closeerrorModal = () => {
        modal.hide();
        modal.remove();
        isDisableButton = false;
      }

      $scope.errorModal.show();

    });

  };

  $scope.isFocus = () => {
    return isFocused;
  };

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

    if(isDisableButton) return;

     isDisableButton = true;

    User.signIn($scope.user).then((data) => {

      $scope.signinPopover.hide();

      if($scope.callback) {
        $scope.callback();
      } else {
        $scope.toShop();
      }

    }).catch((err_message) => {

      $scope.err_message = err_message;
      $scope.openerrorModal();

    })

  };

  $scope.signUp = function() {

    if(isDisableButton) return;

     isDisableButton = true;

    User.signUp($scope.user).then((data) => {

      $scope.signinPopover.hide();
      $scope.signunPopover.hide();

      if($scope.callback) {
        $scope.callback();
      } else {
        $scope.toShop();
      }

    }).catch((err_message) => {

      $scope.err_message = err_message;
      $scope.openerrorModal();

    })

  };

  $scope.forgotPassword = function() {

    if(isDisableButton) return;

    isDisableButton = true;

    User.forgotPassword($scope.user).then((data) => {

      $scope.recovery = false;
      $scope.user = {};
      $scope.err_message = 'Your password was recovered';
      $scope.openerrorModal();
      $scope.$digest();

    }).catch((error) => {

      $scope.err_message = error.message;
      $scope.openerrorModal();

    })

  };
}
