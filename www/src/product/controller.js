import _ from 'lodash';

export default function($scope, $stateParams, $ionicPopover, $state, Item, Size, Location, Address) {

  $scope.animation = 'slide-in-up';

  if($stateParams.id) {

    Item.get({id: $stateParams.id}).then((data) => {

      $scope.item = data;
      $scope.$digest();

    })
  }


  $scope.$watch('item', (newVal, oldVal) => {

    if(newVal && newVal.id) {

      Size.get({id: newVal.id}).then((s) => {

      $scope.sizes = s;
       $scope.basketData = {
         size: s[0]
       };
    });
    }

  });


  var popups = [
    {name: 'moreInfo', url: 'src/brands/subtabs/more-info.html'},
    {name: 'detailPopover', url: './src/product/directives/detail.popover.html'},
    {name: 'basketPopover', url: './src/product/directives/basket.popover.html'}
  ];

   $scope.product = {};
   $scope.chosenType = undefined;
   $scope.isOpenCardPage = false;
   $scope.chosenProduct  =  {
     quantity: 1,
     price: $scope.product.price
   };
   $scope.shipTo = [];
   $scope.basketData = {};
   $scope.city = {};
   $scope.shipAddress = {};

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
  });


    $scope.addShipAddress = () => {

      Location.getbyZip({id:  $scope.shipAddress.zip}).then((data) => {
        $scope.city = data;

        if($scope.shipAddress.city != $scope.city.name && $scope.shipAddress.city != $scope.city.alternative_name) {
          $scope.shipAddress.city = $scope.city.alternative_name;
          $scope.$digest();

        } else {

          Address.add({
            cityId: $scope.shipAddress.city.id,
            street: $scope.shipAddress.street,
            build: $scope.shipAddress.build,
            zip: $scope.shipAddress.zip,
            phone: $scope.shipAddress.phone

          }).then((data) => {
            console.log('Юху!!!!')
          })

        }
      });

    };

    $scope.changeQuantityProduct = (value) => {

      if( (value < 0 && $scope.chosenProduct.quantity > 0) || value > 0) {
        $scope.chosenProduct.quantity += value;
      }
    };

    $scope.setChosenType = (type) => { //запоминает на какой пункт корзины нажал пользователь
      $scope.chosenType = $scope.chosenType == type ? undefined : type;
    };

    $scope.openCardData = (data) => {
      $scope.isOpenCardPage = data;
    };

    $scope.setBasketData = (data) => {
      _.assign($scope.basketData, data);
     $scope.chosenType = undefined;
    };

    $scope.like = (isLiked, id) => {

      new Promise((resove, reject) => {

        if(isLiked) {
          return Item.like({id: id});
        } else {
          return Item.dislike({id: id});
        }

      }).then((data) => {
        debugger
      })

    };

}
