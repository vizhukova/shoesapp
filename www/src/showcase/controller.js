export default function($scope, $ionicPopover) {

  $scope.animation = 'slide-in-up';

  $scope.products = [1, 2, 3,4 ,5 ,6, 7, 8,9, 0];

  var popups = [
    {name: 'sortPopover', url: './src/shop/sort-popover.html'},
    {name: 'filterPopover', url: './src/shop/filter-popover.html'}
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
}