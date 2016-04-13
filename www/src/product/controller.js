export default function($scope, $ionicPopover) {

  $scope.animation = 'slide-in-up';

  $scope.products = [1, 2, 3,4 ,5 ,6, 7, 8,9, 0];

  var popups = [
    {name: 'optionPopover', url: 'src/shop/productOption-popover.html'},
    {name: 'signunPopover', url: 'src/login/directives/signun.popover.html'},
    {name: 'detailPopover', url: 'src/product/directives/detail.popover.html'}
  ];

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
}
