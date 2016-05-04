export default function($scope, $ionicPopover, $state) {

  $scope.animation = 'slide-in-up';

  $scope.products = [1, 2, 3,4 ,5 ,6, 7, 8,9, 0];
  $scope.chosenProduct = {};

  var popups = [
    {name: 'optionPopover', url: 'src/shop/productOption-popover.html'},
    {name: 'signunPopover', url: 'src/login/directives/signun.popover.html'}
  ];

   $scope.chosenType = undefined;
   $scope.isOpenCardPage = false;


  popups.map((popup)=>{
    $ionicPopover.fromTemplateUrl(popup.url, {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope[popup.name] = popover;
    });

    $scope[`open${popup.name}`] = ()=>{
      $scope[popup.name].show();
    };
  })

  $scope.openProduct = (product, $event) => {

    $scope.chosenProduct = product;

    $ionicPopover.fromTemplateUrl('src/product/template.html', {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope.popover = popover;
      $scope.popover.show($event);
    });

  };


}
