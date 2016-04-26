export default function($scope, $ionicPopover, $state) {

  $scope.animation = 'slide-in-up';

  $scope.products = [1, 2, 3,4 ,5 ,6, 7, 8,9, 0];

  var popups = [
    {name: 'optionPopover', url: 'src/shop/productOption-popover.html'},
    {name: 'signunPopover', url: 'src/login/directives/signun.popover.html'},
    {name: 'detailPopover', url: 'src/product/directives/detail.popover.html'},
    {name: 'basketPopover', url: 'src/product/directives/basket.popover.html'}
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

  $scope.openProductOptionFunc = $scope.opensignunPopover;

  $scope.chosenProduct  =  {
    quantity: 0,
    price: 255
  };

  $scope.shipTo = [];

  $scope.addShipAddress = (data) => {
    console.log($scope.addressForm);
  };

  $scope.changeQuantityProduct = (value) => {

    if( (value < 0 && $scope.chosenProduct.quantity > 0) || value > 0) {

      $scope.chosenProduct.quantity += value;

    }

  };


  $scope.openProduct = (type, $event) => {

      if(type === 'brand'){
        //$state.go("tab.brand-item");

        $ionicPopover.fromTemplateUrl('src/brands/subtabs/brand-item.html', {
          scope: $scope,
          animation: $scope.animation
        }).then((popover)=>{
          $scope.popover = popover;
          $scope.popover.show($event);
        });
      }
      else {
        $state.go("tab.product");
      }

    };


    $scope.setChosenType = (type) => {

      $scope.chosenType = $scope.chosenType == type ? undefined : type;
      console.log($scope.chosenType)

    };

  $scope.openCardData = (data) => {
      $scope.isOpenCardPage = data;
  }

}
