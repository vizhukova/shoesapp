import _ from 'lodash';

export default function($scope, $stateParams, $ionicPopover, $ionicModal, $state, Item, Size, Location, Address, Brand, Settings, Delivery, Payment, Order) {

  $scope.animation = 'slide-in-up';
  $scope.errors = {};

   $scope.product = {};
   $scope.chosenType = undefined; // переменная для хранения выбранного пункта меню корзины
   $scope.isOpenCardPage = false;
   $scope.basketData = {//даные для отправки в сервис для оформления заказа
     quantity: 1
   };
    var city = {}; // объект для сохранения данных о городе при сохранении нового адреса
   $scope.shipAddress = {}; // объект для сохранения нового адреса
   $scope.cardData  = {};// объект для соханения новых данных по карте
   $scope.addresses  = []; // все адреса данного пользователя
   $scope.delivery = []; //переменная для хранения вариантов доставки

  if($stateParams.id) {

    Item.get({id: $stateParams.id}).then((data) => {

      $scope.item = data;
      $scope.$digest();

      return Brand.get({id: data.brandId});

    }).then((brand) => {

      $scope.brand = brand;

    })
  }


  getAddressData();

  $scope.$watch('item', (newVal, oldVal) => {

    if(newVal && newVal.id) {

      Size.getByItem({id: newVal.id}).then((s) => {

      $scope.sizes = s || [];
      $scope.basketData.size = $scope.sizes[0];

    });
    }

  });


  var popups = [
    {name: 'moreInfo', url: 'src/brands/subtabs/more-info.html'},
    {name: 'detailPopover', url: './src/product/directives/detail.popover.html'},
    {name: 'basketPopover', url: './src/product/directives/basket.popover.html'},
    {name: 'login', url: './src/login/directives/login.popover.html'}
  ];

  popups.map((popup)=>{
    $ionicPopover.fromTemplateUrl(popup.url, {
      scope: $scope,
      animation: $scope.animation
    }).then((popover)=>{
      $scope[popup.name] = popover;
    });
  });

  $scope[`openmoreInfo`] = ()=>{
    $scope['moreInfo'].show();
  };

  $scope[`opendetailPopover`] = ()=>{
    $scope['detailPopover'].show();
  };

  $scope[`openlogin`] = ()=>{
    $scope['login'].show();
  };

  $scope[`openbasketPopover`] = ()=>{

    var isLogIn = Settings.isLogIn();

    if(isLogIn) {

      $scope['basketPopover'].show();

    } else {

      $scope['login'].show();

    }


  };

  $ionicModal.fromTemplateUrl('./src/login/directives/error.modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.loginCallback = () => {

    $scope['login'].hide();
    $scope['basketPopover'].show();

  };

  $scope.addShipAddress = () => {

    Location.getbyZip({id:  $scope.shipAddress.zip}).then((data) => {

      if(! data) {
        $scope.errors = {zip: true};
        $scope.$digest();
        return;
      }

      city = data;

      if($scope.shipAddress.city != city.city) {
        $scope.shipAddress.city = city.city;
        $scope.$digest();

      } else {

        var toSend = _.clone($scope.shipAddress);
        toSend.city = city;

        Address.add(toSend).then((data) => {

          $scope.chosenType = '';
          $scope.shipAddress = {};
           getAddressData();
          console.log('Юху!!!!')
          $scope.$digest();

        }).catch(() => {

          $scope.err_message = 'Проверьте правильность введенных данных';
          $scope.modal.show();

        })

      }
    });

  };

  $scope.changeQuantityProduct = (value) => {

    if( (value < 0 && $scope.basketData.quantity > 0) || value > 0) {
      $scope.basketData.quantity += value;
    }
  };

  $scope.setChosenType = (type) => { //запоминает на какой пункт корзины нажал пользователь
    $scope.chosenType = $scope.chosenType == type ? undefined : type;
  };

  $scope.newAddressForm = () => {
    $scope.chosenType  =  $scope.chosenType =='newAddress' ? 'address' : 'newAddress';
  };

  $scope.chooseShippingMethod = (id) => {
    $scope.basketData.delivery  =  _.find($scope.delivery, {id: id});
  };

  $scope.choosePayment = (id) => {
    $scope.basketData.payment = _.find($scope.payments, {id: id});
  }

  $scope.chooseAddress = (id) => {
    $scope.basketData.address = _.find($scope.addresses, {addressId: id});
  };

  $scope.openCardData = (data) => {
    $scope.isOpenCardPage = data;
  };

  $scope.setBasketData = (data) => {
    _.assign($scope.basketData, data);
   $scope.chosenType = undefined;
  };

  $scope.like = (product) => {

      if(product.isLiked) {
        Item.addLiked(product.id);
      } else {
        Item.removeLiked(product.id);
      }

      product.isLiked = !product.isLiked;

    };

  $scope.checkout = () => {

      Order.add($scope.basketData).then(() => {

        $scope['basketPopover'].hide();
         $scope.err_message = 'Заказ успешно оформлен';
         $scope.modal.show();

      }).catch(() => {

         $scope.err_message = 'Ошибка оформления заказа';
         $scope.modal.show();

      })

  };

  function getAddressData() {

    Address.get().then((data) => {

    $scope.addresses = data;
    $scope.basketData.address = data[data.length - 1];
    console.log('ADDDRESSSSSS', data)

    if(data.length === 0) {

      throw new Error();

    } else {

      return Delivery.get({id: data[data.length - 1].addressId});

    }

  }).then((delivery) => {

    $scope.delivery = delivery;

    $scope.basketData.delivery = delivery[delivery.length - 1];

    return Payment.get({id: delivery.id})

  }).then((payments) => {

      $scope.payments = payments;
      console.log('PAYMENT', payments)

  }).catch((error) => {

  })

  }

}
